// 通过 jasmine.Ajax.requests.mostRecent()
// 拿到最近一次请求的 request 对象
// 这个对象是 jasmine-ajax 库伪造的 xhr 对象
// 所以可以使用其相关的 api
export function getAjaxRequest(): Promise<JasmineAjaxRequest> {
  return new Promise(function(resolve) {
    setTimeout(() => {
      return resolve(jasmine.Ajax.requests.mostRecent())
    }, 0)
  })
}
