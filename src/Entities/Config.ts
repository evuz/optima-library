export type DemoConfig = {
  matchDuration: number
  timeBetweenMatches: number
}

export type Config = {
  resultsPageSize: number;
  demo?: DemoConfig;
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
