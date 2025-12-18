# DTI 数据组成

使用 `dcm2bids` 标准化数据结构后，在 `/sub-HC001/dwi` 文件夹中会出现以下文件：

```
sub-HC001_dwi.nii.gz
sub-HC001_dwi.json
sub-HC001_dwi.bval
sub-HC001_dwi.bvec
```

如果另外采集了反向相位编码的数据，则还会出现对应的 `.nii.gz` 文件和 `.json` 文件。

# topup

使用 `fslroi` 提取 `sub-HC001_dwi.nii.gz` 中 `b = 0` 的图像

```
fslroi sub-HC001_dwi.nii.gz PA 16 1 //此处提取的为第 17 张图像
```

推荐提取第一张 `b = 0` 图像