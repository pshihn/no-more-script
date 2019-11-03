# no-more-script

One script to stop all other scripts!

Once this script has been loaded, any script loaded later will not run. 

```html
<script>console.log('inline 1');</script>
<script src="./a.js"></script>
<script defer src="./b.js"></script>

<script src="./no-more-script.js"></script>

<script src="./c.js"></script>
<script defer src="./d.js"></script>
<script>
  console.log('inline 2');
  setTimeout(() => {
    const script = document.createElement('script');
    script.src = './e.js';
    document.head.appendChild(script);
  }, 500);
</script>
```


Output:
```
// Output with no-more-script
inline 1
A
B
  
// Output without no-more-script
inline 1
A
C
inline 2
B
D
E 
```