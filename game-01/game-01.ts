// Función para encontrar el primer subconjunto de 2 números de M que sumen N
//-----------------------------------------------------------------------------
function findFirstSubset(M: number[], N: number): number[] | null {
    // Lista de números vistos del conjunto M
    const seenNumList: Array<boolean> = []; 
    for (const num of M) {
        // Calculamos la diferencia que existe entre N y un número del conjunto M
        const complement = N - num;
        // Si la diferencia corresponde con un número visto del conjunto M
        if (seenNumList[complement]) {
            // Entonces encontramos el número complementario que sumado al número visto resultan ser N
            return [complement, num];
        }
        // Marcar numero como visto
        seenNumList[num] = true;
    }
    
    // No se encontró ningún par
    return null; 
}

// Ejemplo de uso
//-----------------------------------------------------------------------------
const M       = [10, 15, 25, 35, 40];
const N       = 50;
const results = findFirstSubset(M, N);

console.table([results]);
