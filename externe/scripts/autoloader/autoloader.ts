export async function autoloader(loadedModules: Map<string, any>) {
    for(const el of document.querySelectorAll('*')) {
        for (const attr of el.attributes) {
            if (
                attr.name.startsWith('data-fsc-') &&
                !attr.name.replace(/data-fsc-[^-]+/, '').includes('-')  
            ) {
                const moduleName = attr.name.replace('data-fsc-', '')   

                if (loadedModules.has(moduleName)) continue

                try {
                    const module = await import(`~/scripts/${moduleName}/${moduleName}.ts`)
                    loadedModules.set(moduleName, module)
                } catch (err) {                                    
                    console.log(`@/plugins/${moduleName}/${moduleName}.ts`);   
                    console.warn(`❌ Component "${moduleName}" failed to load`, err)
                }            
            }
        }
    }    
}