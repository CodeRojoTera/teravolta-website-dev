// Script temporal para limpiar datos de prueba
// Solo ejecutar UNA VEZ

import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, deleteDoc, doc } from 'firebase/firestore';

// Firebase config (usar las mismas credenciales de lib/firebase.ts)
const firebaseConfig = {
    // Tu config aquí
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function cleanupTestData() {
    console.log('🧹 Limpiando datos de prueba...');

    // Borrar collection "projects" (datos de prueba)
    const projectsRef = collection(db, 'projects');
    const projectsSnapshot = await getDocs(projectsRef);

    console.log(`📦 Encontrados ${projectsSnapshot.size} projects para borrar`);

    const deletePromises = projectsSnapshot.docs.map(projectDoc =>
        deleteDoc(doc(db, 'projects', projectDoc.id))
    );

    await Promise.all(deletePromises);

    console.log('✅ Datos de prueba borrados exitosamente');
    console.log('📝 Nota: La colección "portfolioProjects" está vacía y lista para uso');
}

// Ejecutar
cleanupTestData()
    .then(() => {
        console.log('✨ Limpieza completada!');
        process.exit(0);
    })
    .catch((error) => {
        console.error('❌ Error durante limpieza:', error);
        process.exit(1);
    });
