import { IAuthService, Role } from './IAuthService';
import { getAuth, signInWithEmailAndPassword,
createUserWithEmailAndPassword,signOut,onAuthStateChanged
} from 'firebase/auth';
import { app } from './firebaseConfig';
import { FirebaseDatabaseService } from './FirebaseDatabaseService';

const auth = getAuth(app);

export class FirebaseAuthService implements IAuthService {
    private databaseService: FirebaseDatabaseService;
    
    constructor() {
        this.databaseService = new FirebaseDatabaseService();
    }
    
    signIn(email: string, password: string): Promise<any> {
        return signInWithEmailAndPassword(auth, email, password);
    }
    
    signUp(email: string, password: string): Promise<any> {
        return createUserWithEmailAndPassword(auth, email, password);
    }
    
    signOut(): Promise<void> {
        return signOut(auth);
    }

    onAuthStateChanged(callback: (user: any) => void): () => void {
        return onAuthStateChanged(auth, callback);
    }
        
    getCurrentUser(): any | null {
        return auth.currentUser;
    }
        
    async getUserRoles(user: any): Promise<Role[]> {
        // Para el usuario por defecto, se devuelve siempre el rol ADMIN.
        if (user.email === 'drizo@dlsi.ua.es') {
            return [Role.ADMIN];
        }
        // Delegamos la obtención de roles al servicio de base de datos.
        return this.databaseService.getUserRoles(user.uid);
    }
}