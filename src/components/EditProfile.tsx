const EditProfile = ({
  username,
  avatar,
  onChangeName,
  onChangeAvatar,
}: {
  username: string
  avatar: string
  onChangeName: (value: string) => void
  onChangeAvatar: (value: string) => void
}) => {
  return (
    <div>
      <input
        name='username'
        type='text'
        placeholder='username'
        value={username}
        onChange={(e) => onChangeName(e.target.value)}
      />
      <select value={avatar} onChange={(e) => onChangeAvatar(e.target.value)}>
        <option value='eagle'>Eagle</option>
        <option value='bison'>Bison</option>
        <option value='moose'>Moose</option>
        <option value='bear'>Bear</option>
        <option value='alligator'>Alligator</option>
      </select>
    </div>
  )
}

export default EditProfile
