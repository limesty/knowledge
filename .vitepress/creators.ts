export interface UserAvatar {
  name: string
  avatar: string
}

export interface SocialEntry {
  type: 'github' | 'twitter' | 'email'
  icon: string
  link: string
}

export interface Creators {
  avatar: string
  name: string
  username?: string
  title?: string
  org?: string
  desc?: string
  links?: SocialEntry[]
  nameAliases?: string[]
  emailAliases?: string[]
}

const creatorAvatars: Record<string, string> = {}

const getAvatarUrl = (name: string) => `https://github.com/${name}.png`

export const creators: Creators[] = [
  {
    name: '芷沐沐',
    avatar: creatorAvatars.Limesty,
    username: 'Limesty',
    title: 'www',
    desc: 'www',
    links: [
      { type: 'github', icon: 'github', link: 'https://github.com/Limesty' },
      { type: 'twitter', icon: 'twitter', link: 'https://twitter.com/limestty' },
    ],
    nameAliases: ['芷沐沐'],
    emailAliases: ['limesty@limesty.moe'],
  },
]

export const creatorNames = creators.map(c => c.name)
export const creatorUsernames = creators.map(c => c.username || '')

export const users = creatorUsernames
  .reduce<UserAvatar[]>((acc, name) => {
    creatorAvatars[name] = getAvatarUrl(name)
    acc.push({ name, avatar: creatorAvatars[name] })

    return acc
  }, [])
  .filter(item => !!item.name)
