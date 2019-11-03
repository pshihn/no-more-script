"use strict";
(function () {
    const processedScripts = new Set();
    const block = (script) => {
        if (!processedScripts.has(script)) {
            if (script.hasAttribute('allow-execution')) {
                processedScripts.add(script);
            }
            else {
                script.__type = script.type || script.getAttribute('type');
                script.__src = script.src || script.getAttribute('src');
                script.innerHTML = '';
                script.type = 'javascript/blocked';
                script.src = '';
                script.removeAttribute('src');
                // Firefox specific code
                const beforeScriptExecuteListener = function (event) {
                    event.preventDefault();
                    script.removeEventListener('beforescriptexecute', beforeScriptExecuteListener);
                };
                script.addEventListener('beforescriptexecute', beforeScriptExecuteListener);
                processedScripts.add(script);
            }
        }
    };
    const observer = new MutationObserver((mutations) => {
        mutations.forEach(({ addedNodes }) => {
            addedNodes.forEach((node) => {
                if (node.nodeType === Node.ELEMENT_NODE && node.tagName.toLowerCase() === 'script') {
                    block(node);
                }
            });
        });
    });
    observer.observe(document.documentElement || document, {
        childList: true,
        subtree: true
    });
})();
