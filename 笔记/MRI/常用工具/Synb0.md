# Synb0

## 相关链接

### 仓库

https://github.com/MASILab/Synb0-DISCO

## 引用

```
Schilling KG, Blaber J, Hansen C, Cai L, Rogers B, Anderson AW, Smith S, Kanakaraj P, Rex T, Resnick SM, Shafer AT, Cutting LE, Woodward N, Zald D, Landman BA. Distortion correction of diffusion weighted MRI without reverse phase-encoding scans or field-maps. PLoS One. 2020 Jul 31;15(7):e0236418. doi: 10.1371/journal.pone.0236418. PMID: 32735601; PMCID: PMC7394453.

Schilling KG, Blaber J, Huo Y, Newton A, Hansen C, Nath V, Shafer AT, Williams O, Resnick SM, Rogers B, Anderson AW, Landman BA. Synthesized b0 for diffusion distortion correction (Synb0-DisCo). Magn Reson Imaging. 2019 Dec;64:62-70. doi: 10.1016/j.mri.2019.05.008. Epub 2019 May 7. PMID: 31075422; PMCID: PMC6834894.
```

## 使用方法

仓库文档中提供了 Docker 容器与 Singularity 容器中的使用方法。若需要在命令行中运行，则需要对 src/pipeline.sh 这一主脚本及其关联脚本中的路径进行修改。同时需要保证运行环境中存在 Freesurfer、FSL、ANTS 以及包含 PyTorch 的 Python 环境。