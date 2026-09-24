# **PhysViz Core — Coding Style Guide**

*A stable, explicit, consistent coding standard for the PhysViz engine.*

## **1. Naming Conventions**

### **1.1 Classes**

- Use **PascalCase**.
- Always use explicit class declarations.
- Never use anonymous classes.
- Prefer meaningful names that reflect architectural roles.

**Examples:**

js

```
class DomainObject { }
class PhaseWedgeObject { }
class BusExtension { }
```

### **1.2 Methods**

- Use **camelCase**.
- Methods must be explicitly named.
- No anonymous functions assigned to fields unless absolutely required.

### **1.3 Objects**

- Use explicit `new ClassName()` construction.
- Never return unnamed object literals from factory functions unless unavoidable.

## **2. Object Construction**

### **2.1 Always prefer explicit construction**

js

```
const obj = new PhaseWedgeObject("PrimaryFoE_ABC", abcDomain);
```

### **2.2 Avoid temporary unnamed objects**

❌ Avoid:

js

```
return { x: 1, y: 2 };
```

✔ Prefer:

js

```
const point = new Point(1, 2);
return point;
```

### **2.3 Avoid anonymous returns**

❌ Avoid:

js

```
return new class { ... };
```

✔ Prefer:

js

```
class Something { }
return new Something();
```

## **3. JavaScript‑Only Features**

### **3.1 Allowed only when architecturally necessary**

Examples of acceptable JS‑only features:

- dynamic method injection
- prototype extension
- capability attachment
- closures for encapsulation

### **3.2 Must include a comment explaining why**

js

```
// JS-only feature: dynamic method injection
// Reason: capabilities must be attachable at runtime
object.someMethod = function() { ... };
```

### **3.3 Must be used consistently**

If one extension uses dynamic injection, all extensions should follow the same pattern.

## **4. Extensions and Capabilities**

### **4.1 Extensions must be explicit classes**

Each extension must:

- be a named class
- have a constructor
- have an `onAttach(object)` method
- modify the object in predictable ways

### **4.2 No ad‑hoc functions**

❌ Avoid:

js

```
object.extend(function() { ... });
```

✔ Prefer:

js

```
object.extend(new UpdateExtension());
```

### **4.3 Extensions must not overwrite object identity**

Never assign to `this` inside an extension.

## **5. Architecture Stability**

### **5.1 Never delete untested code**

Instead:

- comment it out
- move it to a legacy file
- rename it
- isolate it

### **5.2 Prefer refactoring over rewriting**

If a subsystem needs improvement:

- adjust interfaces
- add capabilities
- reorganize files
- but do not replace working code

### **5.3 Maintain backward compatibility**

New architecture layers must integrate with existing ones.

## **6. Consistency Rules**

### **6.1 Same pattern every time**

If DomainObject uses:

js

```
this.extend(new BusExtension(...));
```

Then *every* object must use the same pattern.

### **6.2 Same naming conventions**

If you use `PhaseWedgeObject`, you must not later introduce `PhaseWedge`.

### **6.3 Same constructor style**

If one class uses:

js

```
constructor(name, parent)
```

Then similar classes should follow the same pattern.

## **7. Developer Reference (for future contributors)**

### **7.1 PhysViz Core is capability‑based**

Objects gain behaviour through extensions, not inheritance.

### **7.2 Bus hierarchy is mandatory**

Every object must attach its bus under its domain.

### **7.3 Update and Render are capabilities**

Objects do not update or render themselves — extensions do.

### **7.4 Domains manage objects**

Domains:

- attach objects
- manage renderers
- manage canvases
- manage update cycles

### **7.5 FSMs attach to MASTER**

FSMs are global controllers.

## **8. Architectural Guide**

### **8.1 Objects**

Objects are lightweight containers for capabilities.

### **8.2 Domains**

Domains are object managers with:

- bus
- canvas
- renderer registry
- object registry

### **8.3 Extensions**

Extensions add behaviour:

- BusExtension
- HintExtension
- UpdateExtension
- RenderExtension
- DomainCanvasExtension
- DomainRendererRegistryExtension
- DomainObjectRegistryExtension

### **8.4 FSM**

FSM controls global behaviour.

## **9. Summary of Style Principles**

- **Explicit over implicit**
- **Named over anonymous**
- **Consistent over clever**
- **Stable over experimental**
- **Refactor over rewrite**
- **Preserve code over delete**
- **JS features only with justification**
- **Architecture must remain flexible**
- **Cognitive load must remain low**