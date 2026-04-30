import birdIcon from '../assets/profile-icons/bird.png'
import dolphinIcon from '../assets/profile-icons/dolphin.png'
import fishIcon from '../assets/profile-icons/fish.png'
import horseIcon from '../assets/profile-icons/horse.png'
import kangarooIcon from '../assets/profile-icons/kangaroo.png'
import penguinIcon from '../assets/profile-icons/penguin.png'
import sharkIcon from '../assets/profile-icons/shark.png'
import snakeIcon from '../assets/profile-icons/snake.png'
import robotIcon from '../assets/profile-icons/robot.png'

export const USER_ICON_MAP: { [key: string]: string } = {
  bird: birdIcon,
  dolphin: dolphinIcon,
  fish: fishIcon,
  horse: horseIcon,
  kangaroo: kangarooIcon,
  penguin: penguinIcon,
  shark: sharkIcon,
  snake: snakeIcon,
}

export const SYSTEM_ICON_MAP: { [key: string]: string } = {
  robot: robotIcon,
}

export default { ...USER_ICON_MAP, ...SYSTEM_ICON_MAP }
