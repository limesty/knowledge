---
tags:
  - 学习/心理学
status: 尚未完成
---
# 假设检验初步 (II) 与 t 检验

## 本章概览

在前一章，我们初步了解了假设检验的基本步骤与两类错误。在本章，我们继续学习 z 检验的相关知识，并且区分了效力和效应，了解提高效力的途径。与 z 检验相比，t 检验大多是在方差未知的情况下进行的，我们以样本方差代替标准差，结合对应的自由度进行假设检验。 

## 学习要点

1. 区分单尾检验与双尾检验
2. 掌握z检验的步骤与前提  
3. 学习什么是效力、怎样提高效力  
4. 学会计算和评价处理效应  
5. 掌握t统计量和t检验的步骤  

## 单尾检验与双尾检验

在进行假设检验之前，我们必须明确规定决策标准，即**显著性水平 (significance level)**，也称 $\alpha$ 水平，其实质是一个特定的概率。在心理学假设中我们一般使用的 $\alpha$ 水平是 $\alpha=5\%$ 或者 $\alpha=1\%$，这些极端值构成的区域被称为**临界区域 (critical regions)**，当样本均值落在其中时，我们认为数据与虚无假设不一，因此拒绝虚无假设。

选择决策标准时同样存在检验的方向性的问题，如果检验是没有方向性的，概率分布曲线的左右两端都属于临界区域，因此我们也将其称为**双尾假设 (two-tailed test)**，这时如果我们事先规定显著性水平 $\alpha=5\%$，那每一段临界区域包含的范围实际上只是总样本均值数量的 2.5%。

如果检验是有方向性的，临界区域只分布在概率分布曲线的一段，我们将其称为**单尾检验 (one-tailed test)**。

## z 检验的前提

1. 随机样本
- 原因：样本必须对总体有代表性，而随机取样有助于确保取样的代表性 。
2. 独立观察
- 原因：与样本代表性有关, 每个观察应该与所有其它观察是独立的。一个特定的观察的概率应当保持恒定。
3. $\sigma$ 保持恒定
- 原因：在 z 检验的处理中，对总体中的每一个个体都加上（或减去）一个常数，总体的均值可能因处理而导致变化，但标准差不变。
4. 取样样本是相对正态的
- 原因：如果取样样本不能近似为正态分布，就无法将它们标准化得到对应的 z 值。
- 相对正态的两种情况：
	- 原总体分布就是正态分布；
	- 由于中心极限定律可以近似为正态分布。
- 相对正态的例子：二项分布

**违反任一前提的后果：** 严重地危及依据样本对总体作出推论的有效性。

## 效力

定义：指该检验能够正确的拒绝一个错误的虚无假设的概率。假设检验的效力反映了假设检验能够正确侦查到真实的处理效应的能力。

[![](http://yanlab.psych.ac.cn/PsychStats/Wiki/lib/exe/fetch.php?w=400&tok=30f6bd&media=%E5%9B%BE%E7%89%871.png)](http://yanlab.psych.ac.cn/PsychStats/Wiki/lib/exe/detail.php?id=%E6%95%88%E5%8A%9B_power&media=%E5%9B%BE%E7%89%871.png "图片1.png")

效力表示为 $power=1-\beta$

影响假设检验效力的因素主要有：
1. 处理效应的大小；
2. 显著性标准；
3. 检验的方向性；
4. 样本容量；
5. 总体和样本的稳定性或误差大小。

## 提高效力的途径

### 增大样本量

增大样本容量，其实是通过减小标准误达到提高效力的目的。标准误减小意味着样本均值的分布更加集中：
![](http://yanlab.psych.ac.cn/PsychStats/Wiki/lib/exe/fetch.php?w=600&tok=15934b&media=%E6%A0%87%E5%87%86%E8%AF%AF%E5%92%8C%E6%95%88%E5%8A%9B.png) 
图中的阴影区域代表统计效力，可以看到样本容量越大，统计效力越高。

### 增大处理效应

处理效应越明显，越容易被侦察到，意味着统计效力越高。

### 减少误差

减少误差即减少方差，减少方差能使检验效果更加显著，从而增大效力。

### 增大 $\alpha$ 水平

增大 $\alpha$ 水平之后临界区域增加，从而拒绝虚无假设的概率增大，统计效力增加： ![](http://yanlab.psych.ac.cn/PsychStats/Wiki/lib/exe/fetch.php?w=600&tok=85ff8f&media=%E6%98%BE%E8%91%97%E6%80%A7%E6%B0%B4%E5%B9%B3%E5%92%8C%E6%95%88%E5%8A%9B.png)

### 采用单尾检验

对于相同的 $\alpha$ 水平，单尾检验的临界区域比双尾检验更大，因此如果差异发生在某一方向上，单尾检验侦察效应的能力高于双尾检验，因此效力更高： ![](http://yanlab.psych.ac.cn/PsychStats/Wiki/lib/exe/fetch.php?w=600&tok=ca062c&media=%E6%A3%80%E9%AA%8C%E7%9A%84%E6%96%B9%E5%90%91%E6%80%A7%E5%92%8C%E6%95%88%E5%8A%9B.png)

## 效应值

### 效应大小的用途

- 处理效应越明显，越容易被侦察到。
- 两总体差异越大，即处理效应越大，处理后的总体中位于临界内的部分较多，阴影区域较大，从而效力较高；右边的图中两总体差异较小，处理后总体位于临界区域的面积，即阴影区域较小，效力较低
- 一个统计检验可能显著但是效应太小以至于没有实际意义
- 当不显著时，效应较大能说明一定的问题

### 效应大小的评价

$$
d=\dfrac{M-\mu}{\sigma}
$$

| 效应大小      | 评价                                 |
| --------- | ---------------------------------- |
| 0<d<0.2   | 小的效应(mean difference<.2 SD)        |
| 0.2<d<0.8 | 中等效应(mean diffenrence around.5 SD) |
| d>0.8     | 大的效应(mean difference >.8 SD)       |

- 拒绝H0时，大的效应显示这是一个重要的效应，小的效应提示研究者应该另辟蹊径
- 接受H0时，差异不显著是因为效力低，效应大说明应该在大样本中重复研究

### 效力和效应大小的区别

- 效力是侦察效应的能力，是统计检验的特性    
- 效应大小是两个分布之间重叠程度的大小，是分布的特性

## t 检验

### t 统计量 (t-statistic)

当总体 $\mu$ 已知，$\sigma$ 未知时，我们用样本方差来估计标准误，用估计标准误作为 $\sigma$ 估计值。  

t 统计量为：  
[![](http://yanlab.psych.ac.cn/PsychStats/Wiki/lib/exe/fetch.php?media=%E7%AC%AC%E5%85%AD%E7%AB%A0:6.6:t1.svg)](http://yanlab.psych.ac.cn/PsychStats/Wiki/lib/exe/detail.php?id=t%E6%A3%80%E9%AA%8C&media=%E7%AC%AC%E5%85%AD%E7%AB%A0:6.6:t1.svg "第六章:6.6:t1.svg")

即：

[![](http://yanlab.psych.ac.cn/PsychStats/Wiki/lib/exe/fetch.php?media=%E7%AC%AC%E5%85%AD%E7%AB%A0:6.6:t2.svg)](http://yanlab.psych.ac.cn/PsychStats/Wiki/lib/exe/detail.php?id=t%E6%A3%80%E9%AA%8C&media=%E7%AC%AC%E5%85%AD%E7%AB%A0:6.6:t2.svg "第六章:6.6:t2.svg")

## t 与 z 的不同适用条件

[![](http://yanlab.psych.ac.cn/PsychStats/Wiki/lib/exe/fetch.php?media=%E7%AC%AC%E5%85%AD%E7%AB%A0:6.6:tandz.svg)](http://yanlab.psych.ac.cn/PsychStats/Wiki/lib/exe/detail.php?id=t%E6%A3%80%E9%AA%8C&media=%E7%AC%AC%E5%85%AD%E7%AB%A0:6.6:tandz.svg "第六章:6.6:tandz.svg")

适用规则：  
1. 当 [![](http://yanlab.psych.ac.cn/PsychStats/Wiki/lib/exe/fetch.php?media=%E7%AC%AC%E5%85%AD%E7%AB%A0:6.6:sigma2.svg)](http://yanlab.psych.ac.cn/PsychStats/Wiki/lib/exe/detail.php?id=t%E6%A3%80%E9%AA%8C&media=%E7%AC%AC%E5%85%AD%E7%AB%A0:6.6:sigma2.svg "第六章:6.6:sigma2.svg") 值已知, 用 [![](http://yanlab.psych.ac.cn/PsychStats/Wiki/lib/exe/fetch.php?media=%E7%AC%AC%E5%85%AD%E7%AB%A0:6.6:z.svg)](http://yanlab.psych.ac.cn/PsychStats/Wiki/lib/exe/detail.php?id=t%E6%A3%80%E9%AA%8C&media=%E7%AC%AC%E5%85%AD%E7%AB%A0:6.6:z.svg "第六章:6.6:z.svg") 分数。
2. 当 [![](http://yanlab.psych.ac.cn/PsychStats/Wiki/lib/exe/fetch.php?media=%E7%AC%AC%E5%85%AD%E7%AB%A0:6.6:sigma2.svg)](http://yanlab.psych.ac.cn/PsychStats/Wiki/lib/exe/detail.php?id=t%E6%A3%80%E9%AA%8C&media=%E7%AC%AC%E5%85%AD%E7%AB%A0:6.6:sigma2.svg "第六章:6.6:sigma2.svg") 值未知, 用 [![](http://yanlab.psych.ac.cn/PsychStats/Wiki/lib/exe/fetch.php?media=%E7%AC%AC%E5%85%AD%E7%AB%A0:6.6:s2.svg)](http://yanlab.psych.ac.cn/PsychStats/Wiki/lib/exe/detail.php?id=t%E6%A3%80%E9%AA%8C&media=%E7%AC%AC%E5%85%AD%E7%AB%A0:6.6:s2.svg "第六章:6.6:s2.svg") 来估计 [![](http://yanlab.psych.ac.cn/PsychStats/Wiki/lib/exe/fetch.php?media=%E7%AC%AC%E5%85%AD%E7%AB%A0:6.6:sigma2.svg)](http://yanlab.psych.ac.cn/PsychStats/Wiki/lib/exe/detail.php?id=t%E6%A3%80%E9%AA%8C&media=%E7%AC%AC%E5%85%AD%E7%AB%A0:6.6:sigma2.svg "第六章:6.6:sigma2.svg")，用 [![](http://yanlab.psych.ac.cn/PsychStats/Wiki/lib/exe/fetch.php?media=%E7%AC%AC%E5%85%AD%E7%AB%A0:6.6:t.svg)](http://yanlab.psych.ac.cn/PsychStats/Wiki/lib/exe/detail.php?id=t%E6%A3%80%E9%AA%8C&media=%E7%AC%AC%E5%85%AD%E7%AB%A0:6.6:t.svg "第六章:6.6:t.svg") 统计量。

## t 统计量的自由度 (Degree of Freedom)

1. 自由度(degree of freedom)：描述了样本中可以自由变化的分数的数目。
2. 若样本容量为n，因为样本均值对于样本中的分数值构成了限制，所以t检验中样本有df=n-1个自由度。
3. t分布的形状受自由度df影响。n的数目越大(或df越大),t分布就越接近正态分布。

## t 分布表 (t-distribution table)

1. t 分布表描述了几个不同的 t 分布。对于每一个不同自由度，都存在一个不同的 t 分布(即使当 df 变大时,差别实际上变得很小)。
2. 表中的每一行都对应于不同的 t 分布，因表中没有足够的空间列出对应每个可能的 t 分数概率，t 分布表中列出的只是最常用的临界区域的 t 分数(即，对应于那些最常用的 $\alpha$ 水平) 。  

[![](http://yanlab.psych.ac.cn/PsychStats/Wiki/lib/exe/fetch.php?w=400&tok=7d9cb7&media=t%E5%88%86%E5%B8%83%E8%A1%A8.png)](http://yanlab.psych.ac.cn/PsychStats/Wiki/lib/exe/detail.php?id=t%E6%A3%80%E9%AA%8C&media=t%E5%88%86%E5%B8%83%E8%A1%A8.png "t分布表.png")

## t 检验 (t-test)

t 检验属于一种推论统计方法，我们根据抽取样本来推测其代表的总体分布。

t 检验的步骤：
1. 陈述H0和H1；确定显著性标准a；
2. 确定检验是单尾还是双尾；
3. 确定检验的自由度**df**；
4. 程序计算或查表得到临界 t 分数；
5. 计算样本的实际t分数；
6. 比较样本的实际 t 分数与临界 t 分数；
7. 对H0作出结论。

$t_{obs}$ =计算出的 t 分数，$t_{crit}$=表中的临界 t 分数。