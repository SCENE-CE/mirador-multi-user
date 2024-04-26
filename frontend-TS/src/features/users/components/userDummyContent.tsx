import { useUsers } from "../api/getUsers.ts";

export const userDummyContent = () => {
  const usersQuery = useUsers()

  if(usersQuery.isLoading){
    return <div>Loading...</div>
  }

  if(!usersQuery.data){
    return <div>NO DATA ! </div>
  }

  const content =usersQuery.data
  return(
    <div>
  <p>this is dummy Content</p>
      <div>
        {
          content.map(user => (
            <div>
              {user.name}
            </div>
          ))
        }
      </div>
</div>
  )
}
