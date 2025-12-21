import { User } from '../types';

interface UserListProps {
  users: User[];
  currentUserId?: string;
}

export const UserList = ({ users, currentUserId }: UserListProps) => {
  return (
    <div className="users-sidebar">
      <h3>
        Онлайн ({users.length})
      </h3>
      
      {users.length === 0 ? (
        <div className="users-empty">
          Нет пользователей
        </div>
      ) : (
        <div className="users-list">
          {users.map(user => {
            const isCurrentUser = user.id === currentUserId;
            
            return (
              <div
                key={user.id}
                className={`user-item ${isCurrentUser ? 'current' : ''}`}
              >
                <div className="user-status" />
                <div className="user-name">
                  {user.nick}
                  {isCurrentUser && (
                    <span className="user-badge">
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
