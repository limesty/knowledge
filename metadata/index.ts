import type { Creator } from '../scripts/types/metadata'
import { getAvatarUrlByGithubName } from '../scripts/utils'

/** 文本 */
export const siteName = 'Nólëbase'
export const siteShortName = 'Nólëbase'
export const siteDescription = '记录回忆，知识和畅想的地方'

/** 文档所在目录 */
export const include = ['笔记', '生活']

/** Repo */
export const githubRepoLink = 'https://github.com/Limesty/knowledge'
/** Discord */
export const discordLink = 'https://discord.gg/XuNFDcDZGj'

/** 无协议前缀域名 */
export const plainTargetDomain = 'n.limesty.moe'
/** 完整域名 */
export const targetDomain = `https://${plainTargetDomain}`

/** 创作者 */
export const creators: Creator[] = [
  {
    name: '芷沐沐',
    avatar: '',
    username: 'limesty',
    title: 'www',
    desc: 'www',
    links: [
      { type: 'github', icon: 'github', link: 'https://github.com/Limesty' },
      { type: 'twitter', icon: 'twitter', link: 'https://twitter.com/limestty' },
    ],
    nameAliases: ['芷沐', 'limesty'],
    emailAliases: ['limesty@limesty.moe'],
  },
].map<Creator>((c) => {
  c.avatar = c.avatar || getAvatarUrlByGithubName(c.username)
  return c as Creator
})

export const creatorNames = creators.map(c => c.name)
export const creatorUsernames = creators.map(c => c.username || '')
