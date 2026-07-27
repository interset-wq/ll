import { useAuth } from '../hooks/useAuth';
import { User, Calendar, Mail } from 'lucide-react';

export default function ProfilePage() {
  const { user } = useAuth();
  if (!user) return null;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Profile</h1>

      <div className="bg-white rounded-2xl border border-gray-200 p-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 rounded-full bg-primary-100 flex items-center justify-center">
            <User className="w-8 h-8 text-primary-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">{user.username}</h2>
            <p className="text-gray-500">Member since {new Date(user.date_joined).toLocaleDateString()}</p>
          </div>
        </div>

        <div className="space-y-4 border-t border-gray-100 pt-6">
          <div className="flex items-center gap-3">
            <User className="w-5 h-5 text-gray-400" />
            <div>
              <div className="text-sm text-gray-500">Username</div>
              <div className="font-medium text-gray-900">{user.username}</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Mail className="w-5 h-5 text-gray-400" />
            <div>
              <div className="text-sm text-gray-500">Email</div>
              <div className="font-medium text-gray-900">{user.email || 'Not set'}</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Calendar className="w-5 h-5 text-gray-400" />
            <div>
              <div className="text-sm text-gray-500">Joined</div>
              <div className="font-medium text-gray-900">{new Date(user.date_joined).toLocaleString()}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
