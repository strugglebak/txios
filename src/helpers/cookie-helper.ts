const cookie = {
  /**
   *
   *
   * @param {string} name cookie key
   * @returns {(string | null)} 对应 value 也就是 token
   */
  getToken(name: string): string | null {
    const match = document.cookie.match(
      new RegExp('(^|;\\s*)(' + name + ')=([^;]*)')
    )
    return match ? decodeURIComponent(match[3]) : null
  }
}

export default cookie
