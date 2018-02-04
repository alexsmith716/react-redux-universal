export default function load() {
  return new Promise(resolve => {
    let resolved  = { message: 'This came from the api server', time: Date.now()}
    console.log('>>>>>>>>>>>>>> api > actions > info > load > resolved: ', resolved);
    resolve(resolved);
  });
}
