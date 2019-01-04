type Name = string & MetaName

export default Name

export interface MetaName {
  type: string
  localName: string
}

type Assign = (target: any, ...sources: any) => any

const assign: Assign = (Object as any).assign

export function makeName(
  type: string,
  localName: string,
  fullName: string = `${type}:${localName}`
): Name {
  const result: Name = assign(fullName, { type, localName })

  result.type = type
  result.localName = localName

  return result
}

export function singletonName(name: string) {
  return makeName(name, name, name)
}

export function typedName(type: string, name: string) {
  return makeName(type, name)
}

export function fullName(fullName: string): Name {
  return makeName(extractType(fullName), extractLocalName(fullName), fullName)
}

function extractType(fullName: string): string {
  const splitterPos = fullName.indexOf(':')
  if (splitterPos == -1) {
    return fullName
  } else {
    return fullName.substring(0, splitterPos)
  }
}

function extractLocalName(fullName: string): string {
  const splitterPos = fullName.lastIndexOf(':')
  if (splitterPos == -1) {
    return fullName
  } else {
    return fullName.substring(splitterPos + 1)
  }
}
