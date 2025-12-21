import { User } from '../types';

interface UserListProps {
  users: User[];
  currentUserId?: string;
}

export const UserList = ({ users, currentUserId }: UserListProps) => {
  return (
    <div style={{
      width: '250px',
      backgroundColor: '#fff',
      borderLeft: '1px solid #ddd',
      padding: '20px',
      overflowY: 'auto',
    }}>
      <h3 style={{
        margin: '0 0 20px 0',
        fontSize: '16px',
        fontWeight: 'bold',
        color: '#333',
      }}>
        Онлайн ({users.length})
      </h3>
      
      {users.length === 0 ? (
        <div style={{
          textAlign: 'center',
          color: '#999',
          fontSize: '14px',
          marginTop: '20px',
        }}>
          Нет пользователей
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {users.map(user => {
            const isCurrentUser = user.id === currentUserId;
            
            return (
              <div
                key={user.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '10px',
                  backgroundColor: isCurrentUser ? '#e3f2fd' : '#f9f9f9',
                  borderRadius: '8px',
                  border: isCurrentUser ? '2px solid #0084ff' : '1px solid #eee',
                }}
              >
                <div style={{
                  width: '10px',
                  height: '10px',
                  borderRadius: '50%',
                  backgroundColor: '#4caf50',
                  flexShrink: 0,
                }} />
                <div style={{
                  flex: 1,
                  fontSize: '14px',
                  fontWeight: isCurrentUser ? 'bold' : 'normal',
                  color: '#333',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}>
                  {user.nick}
                  {isCurrentUser && (
                    <span style={{
                      marginLeft: '5px',
                      fontSize: '12px',
                      color: '#0084ff',
                    }}>
                      (вы)
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
