import { getDatabase, ref, get } from 'firebase/database';
import { app } from '../firebaseConfig';
import { Role } from './IAuthService';
import { IUserDatabaseService } from './IUserDatabaseService';

export interface IUserDatabaseService {
    getUserRoles(uid: string): Promise<Role[]>;
}

export class FirebaseDatabaseService implements IFirebaseDatabaseService {
    async getUserRoles(uid: string): Promise<Role[]> {
        const db = getDatabase(app);
        const rolesRef = ref(db, `users/${uid}/roles`);
        const snapshot = await get(rolesRef);
        if (snapshot.exists()) {
            const rolesData = snapshot.val();
            const roles: Role[] = [];
            if (rolesData.admin === true) {
                roles.push(Role.ADMIN);
            }
            // Aquí se pueden agregar otros roles según se requiera.
            if (roles.length === 0) {
                // Si no se ha asignado ningún rol, se asume el rol de usuario.
                roles.push(Role.USER);
            }
            return roles;
        }
        return [Role.USER];
    }
}