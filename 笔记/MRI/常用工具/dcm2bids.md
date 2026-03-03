# dcm2bids

## 相关链接

### 仓库

https://github.com/UNFmontreal/Dcm2Bids/

### 文档

https://unfmontreal.github.io/Dcm2Bids/

## 引用

### APA

	Boré, A., Guay, S., Bedetti, C., Meisler, S., & GuenTher, N. (2023). Dcm2Bids (Version 3.1.1) [Computer software]. https://doi.org/10.5281/zenodo.8436509

### BibTeX

```
@software{Bore_Dcm2Bids_2023,
author = {Boré, Arnaud and Guay, Samuel and Bedetti, Christophe and Meisler, Steven and GuenTher, Nick},
doi = {10.5281/zenodo.8436509},
month = aug,
title = {{Dcm2Bids}},
url = {https://github.com/UNFmontreal/Dcm2Bids},
version = {3.1.1},
year = {2023}
```

## 使用方法

### 安装

使用 `pipx` ：

```
pipx install dcm2bids
```

将 `dcm2niix` 加入环境变量。[dcm2niix 的 release 页面](https://github.com/rordenlab/dcm2niix/releases)

### 创建配置文件

配置文件示例（来自官方文档）：

```
{
  "descriptions": [
    {
      "datatype": "anat",
      "suffix": "T2w",
      "criteria": {
        "SeriesDescription": "*T2*",
        "EchoTime": 0.1
      },
      "sidecar_changes": {
        "ProtocolName": "T2"
      }
    },
    {
      "id": "task_rest",
      "datatype": "func",
      "suffix": "bold",
      "custom_entities": "task-rest",
      "criteria": {
        "ProtocolName": "func_task-*",
        "ImageType": ["ORIG*", "PRIMARY", "M", "MB", "ND", "MOSAIC"]
      }
    },
    {
      "datatype": "fmap",
      "suffix": "fmap",
      "criteria": {
        "ProtocolName": "*field_mapping*"
      },
      "sidecar_changes": {
        "IntendedFor": "task_rest"
      }
    },
    {
      "id": "id_task_learning",
      "datatype": "func",
      "suffix": "bold",
      "custom_entities": "task-learning",
      "criteria": {
        "SeriesDescription": "bold_task-learning"
      },
      "sidecar_changes": {
        "TaskName": "learning"
      }
    },
    {
      "datatype": "fmap",
      "suffix": "epi",
      "criteria": {
        "SeriesDescription": "fmap_task-learning"
      },
      "sidecar_changes": {
        "TaskName": "learning",
        "IntendedFor": "id_task_learning"
      }
    }
  ]
}
```

最小可用配置文件示例：

```
{
  "descriptions": [
    {
      "datatype": "dwi",
      "suffix": "dwi",
      "criteria": {
        "SeriesDescription": "epi_dti*"
      }
    },
    {
      "datatype": "anat",
      "suffix": "t1w",
      "criteria": {
        "SeriesDescription": "t1*"
      }
    }
  ]
}
```

`datatype` 可选 `func`（任务态和静息态 fMRI）, `dwi`（弥散加权成像）, `anat`（结构像）与 `fmap`（场图）等，参见 [BIDS 文档](https://bids-specification.readthedocs.io/en/stable/common-principles.html#definitions) 中的 Data type 部分。

`suffix` 可选 `T1w`，`T2w`，`dwi` 与 `bold` 等，可能与 `datatype` 相同但不应混淆。参见 [BIDS 文档](https://bids-specification.readthedocs.io/en/stable/common-principles.html#definitions) 中的 Modality 部分。

`criteria` 中填写 `dcm2niix` 生成的 `.json` 文件中可以用于区分不同数据的字段，支持正则表达式。

`custom_entities` 中填写文件名中需要添加的补充信息，如 `run-<index>`（标识重复扫描）、`task-<label>`（标识任务，BIDS 中 rest 也属于一种任务）、`dir-<label>`（标识相位编码方向）与 `acq-<label>`（自定义标识），参见 [BIDS 文档](https://bids-specification.readthedocs.io/en/stable/appendices/entities.html#entities)。如需添加多个补充信息，则将其按一定顺序使用 `_` 相连，如 `dir-<label>_run-<index>`。若顺序有误，`dcm2bids` 会自动调整。

`sidecar_changes` 中填写需要加入到 `.json` 文件中的内容，如 `IntendedFor`（用来标识场图用于某份图像的校正，以便于自动化程序识别）等。

`id` 字段用来在 `dcm2bids` 中进行标识，如在 `IntendedFor` 字段中可以直接使用其他数据的 `id` 字段，`dcm2bids` 在将 `IntendedFor` 字段插入 `.json` 文件时会自动转换为对应数据的路径。

### 命令行

对于被试 `HC001`，使用命令行

```
dcm2bids -d /path/to/HC001 -p HC001 -c /path/to/config.json -o /path/to/output_dir
```

输出结果位于 `/path/to/output_dir/sub-HC001`。若目录 `/path/to/output_dir` 不存在，`dcm2bids` 会自动创建文件夹。`dcm2bids` 会在输出目录下创建 `tmp_dcm2bids` 文件夹，其中包含按 `config.json` 中的规则未能匹配的数据。 

### 相关补充

#### 场图

参见 [BIDS 文档](https://bids-specification.readthedocs.io/en/stable/modality-specific-files/magnetic-resonance-imaging-data.html#fieldmap-data)。

场图有 4 种形式：

1. 相位差图像和至少一张幅值图像
2. 两张相位图像和两张幅值图像
3. 一张场图与一张幅值图像
4. 用于 FSL TOPUP 等工具的具有不同相位编码方向的自旋回波 EPI 扫描

当存在两张幅值图像时，`_magnitude1` 图像对应较短的回波时间，`_magnitude2` 图像对应较长的回波时间。





