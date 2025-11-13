# dcm2bids

## 相关链接

### 仓库

https://github.com/UNFmontreal/Dcm2Bids/

### 文档

https://unfmontreal.github.io/Dcm2Bids/

## 使用方法

### 安装

使用 `pipx` ：

```
pipx install dcm2bids
```

将 `dcm2niix` 加入环境变量 [dcm2niix](https://github.com/rordenlab/dcm2niix/releases)

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

`datatype` 可选 `func`（功能）, `dwi`, `anat`（结构），`meg`（脑电），`beh`（行为学数据）

`suffix` 可选 `T1w`，`T2w`，`dwi` 与 `bold` 等。

`criteria` 中填写 `dcm2niix` 生成的json文件中可以用于区分不同数据的字段，支持正则表达式。

### 命令行

对于被试 `HC001`，使用命令行

```
dcm2bids -d /path/to/HC001 -p HC001 -c /path/to/config.json -o /path/to/output_dir
```

输出结果位于 `/path/to/output_dir/sub-HC001`。

### 批量处理


