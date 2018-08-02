[ithit.webdav.server](../README.md) > [ITHit](../modules/ithit.md) > [WebDAV](../modules/ithit.webdav.md) > [Server](../modules/ithit.webdav.server.md) > [PropertyValue](../classes/ithit.webdav.server.propertyvalue.md)

# Class: PropertyValue

Describes one property associated with hierarchy item object.

## Hierarchy

**PropertyValue**

## Index

### Constructors

* [constructor](ithit.webdav.server.propertyvalue.md#constructor)

### Accessors

* [QualifiedName](ithit.webdav.server.propertyvalue.md#qualifiedname)
* [Value](ithit.webdav.server.propertyvalue.md#value)

---

## Constructors

<a id="constructor"></a>

###  constructor

⊕ **new PropertyValue**(name?: *`PropertyName`*, value?: * `undefined` &#124; `string`*): [PropertyValue](ithit.webdav.server.propertyvalue.md)

*Defined in PropertyValue.ts:17*

Initializes new instance.

**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| `Optional` name | `PropertyName` |  Property name. |
| `Optional` value |  `undefined` &#124; `string`|  Property value. |

**Returns:** [PropertyValue](ithit.webdav.server.propertyvalue.md)

___

## Accessors

<a id="qualifiedname"></a>

###  QualifiedName

getQualifiedName(): `PropertyName`setQualifiedName(value: *`PropertyName`*): `void`

*Defined in PropertyValue.ts:36*

**Returns:** `PropertyName`

*Defined in PropertyValue.ts:39*

**Parameters:**

| Param | Type |
| ------ | ------ |
| value | `PropertyName` |

**Returns:** `void`

___
<a id="value"></a>

###  Value

getValue(): `String`setValue(value: *`String`*): `void`

*Defined in PropertyValue.ts:29*

**Returns:** `String`

*Defined in PropertyValue.ts:32*

**Parameters:**

| Param | Type |
| ------ | ------ |
| value | `String` |

**Returns:** `void`

___

