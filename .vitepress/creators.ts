export interface SocialEntry {
  type: 'github' | 'twitter' | 'email'
  icon: string
  link: string
}

export interface Creator {
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

const getAvatarUrl = (name: string) => `https://github.com/${name}.png`

export const creators: Creator[] = [
  {
    name: '芷沐沐',
    avatar: '',
    username: 'Limesty',
    title: 'www',
    desc: 'www',
    links: [
      { type: 'github', icon: 'github', link: 'https://github.com/Limesty' },
      { type: 'twitter', icon: 'twitter', link: 'https://twitter.com/limestty' },
    ],
    nameAliases: ['芷沐沐', 'Limesty'],
    emailAliases: ['limesty@limesty.moe'],
  },
].map<Creator>((c) => {
  c.avatar = c.avatar || getAvatarUrl(c.username)
  return c as Creator
})

export const creatorNames = creators.map(c => c.name)
export const creatorUsernames = creators.map(c => c.username || '')
