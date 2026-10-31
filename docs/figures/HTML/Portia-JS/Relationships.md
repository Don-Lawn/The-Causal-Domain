#  Relationships

| **Axis**             | **FromRole A**   | **ToRole B**   | **Relationship** | **Forwards**    | **Backwards**           | **Mult A** | **Mult B** | **Reflex** | **Trans** | **Symmetric** |
| -------------------- | ---------------- | -------------- | ---------------- | --------------- | ----------------------- | ---------- | ---------- | ---------- | --------- | ------------- |
| **Evolution**        | Predecessor      | Successor      | Sequence         | comesBefore     | comesAfter              | 1          | *          |            | T         |               |
| **Abstraction**      | Metadata         | Subject        | Description      | Describes       | isDescribedBy           | *          | *          |            |           |               |
| **Composition**      | Composite        | Part           | Composition      | isComposedOf    | isComposedInto          | 1          | *          |            |           |               |
| **Aggregation**      | Collection       | Element        | Aggregates       | logicallyGroups | areLogicallyGroupedInto | *          | *          |            |           |               |
| **Representation**   | Authority        | Representative | Representation   | isRepresentedBy | represents              | 1          | *          |            |           |               |
| **Manifestation**    | Creator          | Creation       | Creation         | Creates         | isCreatedBy             | 1          | *          |            |           |               |
| **Translation**      | Format           | Format         | Translates       | translatesTo    | translatesTo            | *          | *          | T          |           | T             |
| **Canonicalisation** | Format.Canonical | Format         | Translation      | translatesTo    | translatesTo            | 1          | *          | T          |           |               |
| **identification**   | Register         | Subject        | Identification   | identifies      | isIdentifiedBy          | *          | *          |            |           |               |

# 

 

 

 

 

 

 

 

 

 

# Patterns

| **Pattern**        | **Relationship**                          |
| ------------------ | ----------------------------------------- |
| **List**           | Sequence                                  |
| **Stack**          | Sequence                                  |
| **Queue**          | Sequence                                  |
| **Tree**           | Sequence                                  |
| **Categorisation** | Aggregation                               |
| **Iteration**      | Aggregation, Identification,  Sequence    |
| **Index**          | Aggregation,   identification,   sequence |
| **FacetMap**       | Tree, Aggregation, Categorisation         |

 

 

 

 

 