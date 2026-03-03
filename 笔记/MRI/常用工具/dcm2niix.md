# dcm2niix

## 相关链接

### 主页

https://www.nitrc.org/plugins/mwiki/index.php/dcm2nii:MainPage

### 仓库

https://github.com/rordenlab/dcm2niix/

## 使用方法

如果要需要BIDS结构的数据，建议直接使用dcm2bids。

在 `dcm2bids` 中使用的命令为：

```
dcm2niix -b y -ba y -z y -f %3s_%f_%p_%t -o /path/to/output_dir /path/to/dicom_dir
```

`-b y` 指生成 BIDS 格式的 `.json` 文件（sidecar 文件）。

`-ba y` 指在生成的 `.json` 文件中开启匿名化。

`-z y` 指开启压缩，将输出保存为 `.nii.gz` 格式。

`-f %3s_%f_%p_%t` 指定了输出文件名的格式，即”3位扫描序列号_原文件夹名_ProtocolName_扫描时间“。