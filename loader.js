(async function() {
    try {
        const parts = ['dsm_part1.js','dsm_part2.js','dsm_part3.js','dsm_part4.js','dsm_part5.js','dsm_part6.js'];
        let combined = '';
        for (const p of parts) {
            const resp = await fetch('./' + p);
            if (!resp.ok) throw new Error('Failed to load ' + p + ': ' + resp.status);
            combined += await resp.text();
            combined += '\n';
        }
        const blob = new Blob([combined], { type: 'application/javascript' });
        const url = URL.createObjectURL(blob);
        const script = document.createElement('script');
        script.src = url;
        document.body.appendChild(script);
    } catch(e) {
        console.error('DSM Loader Error:', e);
        document.body.innerHTML = '<div style="color:red;padding:20px;">Error loading application: ' + e.message + '</div>';
    }
})();
