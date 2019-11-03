interface BlockScriptElement extends HTMLScriptElement {
  __src: string | null; // original source
  __type: string | null; // original type
}

(function () {
  const processedScripts = new Set<BlockScriptElement>();

  const block = (script: BlockScriptElement) => {
    if (!processedScripts.has(script)) {
      if (script.hasAttribute('allow-execution')) {
        processedScripts.add(script);
      } else {
        script.__type = script.type || script.getAttribute('type');
        script.__src = script.src || script.getAttribute('src');
        script.innerHTML = '';
        script.type = 'javascript/blocked';
        script.src = '';
        script.removeAttribute('src');

        // Firefox specific code
        const beforeScriptExecuteListener = function (event: Event) {
          event.preventDefault();
          script.removeEventListener('beforescriptexecute', beforeScriptExecuteListener);
        };
        script.addEventListener('beforescriptexecute', beforeScriptExecuteListener);
        processedScripts.add(script);
      }
    }
  };

  const observer = new MutationObserver((mutations: MutationRecord[]) => {
    mutations.forEach(({ addedNodes }) => {
      addedNodes.forEach((node) => {
        if (node.nodeType === Node.ELEMENT_NODE && (node as Element).tagName.toLowerCase() === 'script') {
          block(node as BlockScriptElement);
        }
      });
    });
  });
  observer.observe(document.documentElement || document, {
    childList: true,
    subtree: true
  });
})();