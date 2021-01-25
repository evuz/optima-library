export interface Config {
  resultsPageSize: number;
  matchDuration: number;
}

export function createConfig (configuration: Config): Config {
  return new Proxy(configuration, {
    get: function (conf, name) {
      if (!(name in conf)) {
        throw Error(`${String(name)} is not exist in your configuration`)
      }
      return conf[name]
    }
  })
}
