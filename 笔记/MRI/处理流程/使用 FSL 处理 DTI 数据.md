在以下处理过程中，处理时间默认为使用 Intel Core Ultra 9 285K 处理器与 Nvidia RTX 4060 显卡处理一例尺寸为 112x112x75 ，各向同性分辨率为 2 毫米，30个梯度方向的 DTI 数据时所需的时间。

# DTI 数据组成

使用 `dcm2bids` 标准化数据结构后，在 `/sub-HC001/dwi` 文件夹中会出现以下文件：

```
sub-HC001_dwi.nii.gz
sub-HC001_dwi.json
sub-HC001_dwi.bval
sub-HC001_dwi.bvec
```

如果另外采集了反向相位编码的数据，则还会出现对应的 `.nii.gz` 文件和 `.json` 文件。由于反向相位编码的数据在 $b=0$ 时采集，故没有对应的 `.bval` 文件和 `bvec` 文件。

观察 `.json` 文件中的 `PhaseEncodingDirection` 字段，若为 `j` 则代表相位编码方向为 `PA`，若为`-j` 则代表相位编码方向为 `AP`。
# topup

使用 `fslroi` 提取 `sub-HC001_dwi.nii.gz` 中 $b = 0$ 的图像

```
fslroi sub-HC001_dwi.nii.gz PA 0 1 //此处提取的为第 1 张图像
```

强烈推荐提取第一张 $b = 0$ 图像，

```
fslmerge -t PA_AP PA AP
```

将两张图像按顺序合并。

```
printf "0 1 0 0.0646\n0 -1 0 0.0646" > acqparams.txt
```

在 `acqparams.txt` 文件中，第 n 行代表 `PA_AP.nii.gz` 中第 n 张图像的参数。前三个数代表相位编码方向，如 `0 1 0` 代表 `PA`，`0 -1 0` 代表 `AP`。每一行的最后一个数对应的是 `.json` 文件中的 `TotalReadoutTime` 字段。若仅将生成的结果用于 `eddy`，可将最后一个数替换为 `0.05`。

```
topup --imain=PA_AP --datain=acqparams.txt --config=b02b0.cnf --out=my_topup_results --iout=my_hifi_b0
```

`config` 可选 `b02b0_1.cnf`、`b02b0_2.cnf`、`b02b0_4.cnf`。`b02b0.cnf` 是 `b02b0_2.cnf` 的别名。当图像尺寸中存在一个奇数（如 $96\times 96\times 51$）时，必须使用 `b02b0_1.cnf`；当图像尺寸为 2 的倍数（如 $96\times 96\times 50$）时，可以使用 `b02b0.cnf` 或 `b02b0_2.cnf`；而当图像尺寸是 4 的倍数（如 $96\times 96\times 52$）时可以使用 `b02b0_4.cnf` 来提高处理速度。

可以添加 `--nthr = n` 以使用多线程加速。单线程约需 4 分钟，多线程约需 1 分钟。`b02b0_4.cnf` 相对于 `b02b0_1.cnf` 约提升 30%。

# eddy

```
fslmaths my_hifi_b0 -Tmean my_hifi_b0
```

对于一对输入，`topup` 的输出 `my_hifi_b0` 通常包含两张图像，此处将这两张图像取平均值。

```
bet my_hifi_b0 my_hifi_b0_brain -m
```

创建掩膜 `my_hifi_b0_brain_mask.nii.gz`。

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

`eddy` 在可以调用 GPU 时将运行 `eddy_cuda`，否则运行 `eddy_cpu`。`eddy_cuda` 只能使用 CPU 单线程，`eddy_cpu` 可以指定多线程。`eddy_cuda` 约需 5 分钟。

当 `b-value` 较多时可以添加 `--data_is_shelled` 以避免报错。

# dtifit

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

# bedpostx

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

`bedpostx_gpu` 约需 12-15 分钟，若使用 `bedpostx` 则会自动调用所有可用的 CPU 核并行计算，服务器 20 核并行约需 1 小时。

# 附录

## 什么是同步多层扫描


## 如何确定磁场梯度方向覆盖范围

```
bvecs = load('bvecs'); % Assuming your filename is bvecs
figure('position',[100 100 500 500]);
plot3(bvecs(1,:),bvecs(2,:),bvecs(3,:),'*r');
axis([-1 1 -1 1 -1 1]);
axis vis3d;
rotate3d
```