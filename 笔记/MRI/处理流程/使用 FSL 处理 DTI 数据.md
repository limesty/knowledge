# 使用 FSL 处理 DTI 数据

在以下处理过程中，处理时间默认为使用 Intel Core Ultra 9 285K 处理器与 Nvidia RTX 4060 显卡处理一例尺寸为 112x112x75 ，各向同性分辨率为 2 毫米，30个梯度方向的 DTI 数据时所需的时间。

## DTI 数据组成

使用 `dcm2bids` 标准化数据结构后，在 `/sub-HC001/dwi` 文件夹中会出现以下文件：

```
sub-HC001_dwi.nii.gz
sub-HC001_dwi.json
sub-HC001_dwi.bval
sub-HC001_dwi.bvec
```

如果另外采集了反向相位编码的数据，则还会在 `/sub-HC001/fmap` 出现对应的 `.nii.gz` 文件和 `.json` 文件。由于反向相位编码的数据在 $b=0$ 时采集，可能没有对应的 `.bval` 文件和 `bvec` 文件。

在常用的横断面扫描中，观察 `.json` 文件中的 `PhaseEncodingDirection` 字段，若为 `j` 则代表相位编码方向为 `PA`，若为`-j` 则代表相位编码方向为 `AP`。
## topup

```
fslroi sub-HC001_dwi.nii.gz PA 0 1 //此处提取的为第 1 张图像
```

使用 `fslroi` 提取 `sub-HC001_dwi.nii.gz` 中 $b = 0$ 的图像。强烈推荐提取第一张 $b = 0$ 图像。

```
fslmerge -t PA_AP PA AP
```

将两张图像按顺序合并，从需要处理的数据中提取的 $b = 0$ 图像在前。

```
printf "0 1 0 0.0646\n0 -1 0 0.0646" > acqparams.txt
```

在 `acqparams.txt` 文件中，第 n 行代表 `PA_AP.nii.gz` 中第 n 张图像的参数。前三个数代表相位编码方向，如 `0 1 0` 代表 `PA`，`0 -1 0` 代表 `AP`。每一行的最后一个数对应的是 `.json` 文件中的 `TotalReadoutTime` 字段。若仅将生成的结果用于 `eddy`，可将最后一个数替换为 `0.05`。

```
topup --imain=PA_AP --datain=acqparams.txt --config=b02b0.cnf --out=my_topup_results --iout=my_hifi_b0
```

`config` 可选 `b02b0_1.cnf`、`b02b0_2.cnf`、`b02b0_4.cnf`。`b02b0.cnf` 是 `b02b0_2.cnf` 的别名。当图像尺寸中存在一个奇数（如 $96\times 96\times 51$）时，必须使用 `b02b0_1.cnf`；当图像尺寸为 2 的倍数（如 $96\times 96\times 50$）时，可以使用 `b02b0.cnf` 或 `b02b0_2.cnf`；而当图像尺寸是 4 的倍数（如 $96\times 96\times 52$）时可以使用 `b02b0_4.cnf` 来提高处理速度。

可以添加 `--nthr = n` 以使用多线程加速。单线程约需 4 分钟，多线程约需 1 分钟。`b02b0_4.cnf` 相对于 `b02b0_1.cnf` 约提升 30%。

## eddy

```
fslmaths my_hifi_b0 -Tmean my_hifi_b0
```

对于一对输入，`topup` 的输出 `my_hifi_b0` 通常包含两张图像，此处将这两张图像取平均值。

```
bet my_hifi_b0 my_hifi_b0_brain -m
```

创建掩膜 `my_hifi_b0_brain_mask.nii.gz`。一定要检查去脑壳的结果文件 `my_hifi_b0_brain.nii.gz` 中图像是否完整！

```
indx=""
for ((i=1; i<=n; i+=1)); do indx="$indx 1"; done
echo $indx > index.txt
```

此处 `n` 的值为 `sub-HC001_dwi.nii.gz` 中的图像张数，`sub-HC001_dwi.nii.gz` 中图像参数与 `PA.nii.gz` 中图像参数相同，均对应 `acqparams.txt` 中第一行。

标准的运行 `eddy` 的命令如下所示：

```
eddy --imain=sub-HC001_dwi.nii.gz --mask=my_hifi_b0_brain_mask --acqp=acqparams.txt --index=index.txt --bvecs=sub-HC001_dwi.bvec --bvals=sub-HC001_dwi.bval --topup=my_topup_results --out=eddy_corrected_data
```

如果需要 `eddy` 删除由于被试头动而产生的异常值切片并替换为高斯过程预测的切片，则可以添加 `--repol` 参数。事实上 FSL 文档建议使用该参数，并可能在后续版本将 `--repol` 替换为 `--no_repol`。如果数据采用同步多层扫描，则需要添加 `--json=sub-HC001_dwi.json`。

如果磁场梯度方向只覆盖半个球面，则需要添加 `--slm=linear` 参数。

如果被试存在剧烈头动（如在一组切片的扫描过程中头部位置发生明显移动），可能会导致图像出现明显的锯齿状图案。此时需要使用 `eddy` 的切片到体积的校正。完整的运行命令如下所示：

```
eddy --imain=sub-HC001_dwi.nii.gz --mask=my_hifi_b0_brain_mask --acqp=acqparams.txt --index=index.txt --bvecs=sub-HC001_dwi.bvec --bvals=sub-HC001_dwi.bval --topup=my_topup_results --niter=8 --fwhm=10,8,4,2,0,0,0,0 --repol --json=my_json_file.json --out=eddy_corrected_data --mporder=16
```

其中 `--mporder` 的值介于 $N_{sl}/2$ 和 $N_{sl}/8$ 之间，其中 $N_{sl}$ 是数据的切片数。执行切片到体积的校正用时较长。

`eddy` 还可以校正由于被试头部转动而产生的磁场变化，只需要添加 `--estimate_move_by_susceptibility` 即可。

`eddy` 在可以调用 GPU 时将运行 `eddy_cuda`，否则运行 `eddy_cpu`。`eddy_cuda` 只能使用 CPU 单线程，`eddy_cpu` 可以指定多线程。`eddy_cuda` 约需 5 分钟。

当 `b-value` 较多时可以添加 `--data_is_shelled` 以避免报错。

## dtifit

```
dtifit -k eddy_corrected_data.nii.gz -o dtifit_output -m hifi_b0_brain_mask.nii.gz -r eddy_corrected_data.eddy_rotated_bvecs -b sub-HC001_dwi.bval
```

此处使用 `eddy` 旋转后的 `.eddy_rotated_bvec` 文件而非原始的 `.bvec` 文件。如果不使用 `-o` 参数，则默认使用 `dti` 作为输出文件名的前半部分。

输出结果包含以下文件：

```
dtifit_output_FA.nii.gz
dtifit_output_L1.nii.gz
dtifit_output_L2.nii.gz
dtifit_output_L3.nii.gz
dtifit_output_MD.nii.gz
dtifit_output_MO.nii.gz
dtifit_output_S0.nii.gz
dtifit_output_tensor.nii.gz
dtifit_output_V1.nii.gz
dtifit_output_V2.nii.gz
dtifit_output_V3.nii.gz
```

`dtifit` 运行时间约 1 分钟。

## TBSS

使用 `TBSS` 可以分析 FA、MD 等指标。需要将所有被试的 FA 图像移动至同一个文件夹。

```
tbss_1_preproc *.nii.gz
```

在文件夹中运行 `tbss_1_preproc` 会将所有 FA 图像略微腐蚀后移动到一个名为 `FA` 的子目录中，将原始 FA 图像放置在另一个名为 `origdata` 的子目录中，并运行 `slicesdir` 以便检查存在问题的图像。  

`tbss_2_reg` 使用非线性配准将所有 FA 图像对齐到 1x1x1mm 标准空间。使用 `-T` 参数可以将 FMRIB58_FA 标准空间图像作为配准目标，也可以使用 `-t` 参数选择其他配准目标。另外，使用 `-n` 参数可以将每个 FA 图像与其他图像对齐，识别“最具代表性”的图像，并将其用作目标图像，最后将目标图像对齐到 MNI152 空间。

`tbss_3_postreg` 将所有 FA 图像转换到标准空间并合成一个文件，并生成平均骨架。使用 `-S` 参数会基于已有的 FA 图像计算平均骨架，使用 `-T` 参数则会基于 FMRIB58_FA 模板计算平均骨架。

`tbss_4_prestats` 将所有被试的 FA 图像置于骨架上，通常使用的参数为 `0.2`，即

```
tbss_4_prestats 0.2
```

如果需要分析 FA 值之外的指标（如 MD），则需要在完成 FA 图像的处理步骤后，将 MD 图像复制到与 `origdata`、`FA`、`stats` 文件夹在同一目录下的 `MD` 文件夹，并运行

```
tbss_non_FA MD
```

需要保证同一被试的 MD 图像文件名与 FA 图像文件名相同（即使文件名中包含 FA）。

## bedpostx

`bedpostx` 需要在文件夹内准备以下四个文件：

```
data.nii.gz
nodif_brain_mask.nii.gz
bvals
bvecs
```

依次对应：

```
eddy_corrected_data.nii.gz
hifi_b0_brain_mask.nii.gz
sub-HC001_dwi.bval
eddy_corrected_data.eddy_rotated_bvecs
```

运行 `bedpostx`：

```
bedpostx_gpu bedpostx_input_dir
```

`bedpostx_gpu` 约需 12 分钟，若使用 `bedpostx` 则会自动调用所有可用的 CPU 核并行计算。

## 配准

`FSL` 中一般使用 `flirt` 和 `fnirt` 进行配准。当掩膜位于标准空间时必须进行配准才能运行 `probtrackx`。

### 结构空间配准到标准空间

结构空间配准到标准空间既可以使用线性配准 `flirt`，也可以使用非线性配准 `fnirt`。由于线性配准精度较低，非线性配准受初始估计（`--aff` 的值）影响较大，因此将线性配准的结果用于非线性配准是一种有效的策略。

```
flirt -in struct_brain.nii.gz -ref MNI152_T1_2mm_brain.nii.gz -omat str2std.mat -dof 12
fnirt --in=struct.nii.gz --aff=str2std.mat --cout=str2std_warp --config=T1_2_MNI152_2mm
```

需要注意的是，线性配准中需要使用去脑壳后的结构像，而非线性配准中需要使用包含脑壳的结构像。如果在线性配准中使用了包含脑壳的结构像或去脑壳不完全的结构像，那么可能会出现图像翻转的情况，在 `.mat` 文件中表现为矩阵主对角线上的值与 1 偏差很大。可以预先使用 `robustfov` 命令进行裁剪来避免这个情况。

### 扩散空间配准到结构空间

由于同一个被试的扩散空间与结构空间形状相同，因此常使用 `flirt` 进行线性配准。

```
flirt -in my_hifi_b0_brain.nii.gz -ref struct_brain.nii.gz -omat dwi2str.mat -dof 6
```

### 计算逆矩阵与逆变形场

```
convert_xfm -omat str2dwi.mat -inverse dwi2str.mat //计算逆矩阵
invwarp --warp=str2std_warp.nii.gz --out=std2str_warp.nii.gz --ref=struct.nii.gz //计算逆变形场
```

### 合并变形场

```
convertwarp --ref=MNI152_T1_2mm_brain.nii.gz --premat=dwi2str.mat --warp1=str2std_warp.nii.gz --out=dwi2std_warp.nii.gz --relout
convertwarp --ref=my_hifi_b0_brain.nii.gz --warp1=std2str_warp.nii.gz --postmat=str2dwi.mat --out=std2dwi_warp.nii.gz --relout
```

## probtrackx

```
probtrackx2_gpu -s bedpostx_input.bedpostX/merged 
				-m my_hifi_b0_brain_mask.nii.gz
                -x masks.txt
                --network
                --dir=probtrack_results
                --os2t //存储从种子点到目标点的连接图像
                --nsamples=5000
                --seedref=$FSLDIR/data/standard/MNI152_T1_2mm_brain.nii.gz
                --xfm=std2dwi_warp.nii.gz
                --invxfm=dwi2std_warp.nii.gz
                --targetmasks=masks.txt
                --avoid=avoid_mask.nii.gz
                --ompl //存储纤维的平均长度
                --loopcheck
```
## 相关补充

### 什么是同步多层扫描

同步多层扫描 (Simultaneous Multi-Slice, SMS) 技术，也叫多带 (Multiband) 技术，通过在一次射频激发中同时采集多个空间层面的数据，大幅缩短扫描时间。

通常来说，采用这种技术的数据，其 `.json` 文件中的 `SliceTiming` 字段中会出现两个或以上相同的值，`MultibandAccelerationFactor` 的值为大于 1 的整数。

### 如何确定磁场梯度方向覆盖范围

在 matlab 中运行以下脚本：

```
bvecs = load('bvecs'); % Assuming your filename is bvecs
figure('position',[100 100 500 500]);
plot3(bvecs(1,:),bvecs(2,:),bvecs(3,:),'*r');
axis([-1 1 -1 1 -1 1]);
axis vis3d;
rotate3d
```
