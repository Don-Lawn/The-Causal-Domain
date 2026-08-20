## **H**

### **Hankel Transform (Radial Fourier Transform)**

**Definition**  

A radial version of the Fourier transform used when the geometry is circular or spherically symmetric.  
It replaces the exponential kernel with a Bessel function, reflecting the fact that radial propagation depends on distance rather than Cartesian coordinates.

**Conceptual Role**  

The Hankel transform is the natural FT for:

- circular orbits  
- radial propagation  
- fields depending only on distance from the centre  
- phase delay proportional to radius  

It appears whenever the OP‑layer has radial symmetry, making it the correct transform for analysing radial projections of the ribbon or orbit.

**Geometric Expression**  

For a radial function \(f(r)\):
$$
\tilde{f}(k) = \int_0^\infty f(r)\, J_0(kr)\, r\, dr
$$

**Cross‑links**  

Radial Coordinate, Fourier Transform, Ribbon, Phase Rotation, Projection, x/k Duality.

**Interpretive Summary**  

The Hankel transform is the radial analogue of the Fourier transform.  
Whenever the geometry is circular or radially symmetric, the FT becomes a Hankel transform, with Bessel functions replacing exponentials.  
It is the correct tool for radial projections in the OP‑framework.

### **Hypersphere (k‑sphere)**

**Definition**

he 3‑sphere representing the child layer’s energy or momentum distribution in the \(k\)-domain.  
It is the Fourier‑dual of the spatial x‑sphere.

**Conceptual Role**

The k‑sphere is the target domain of the layer‑local Fourier transform.  
It encodes how the child’s energy is distributed across momentum space once the geometry has been mapped out of the x‑domain.  
Together with the x‑sphere, it forms the dual‑hypersphere structure that underpins the OP‑layer.

**Geometric Expression**

A hypersphere in the energy domain:
$$
S_k^3 = \{\, \mathbf{k} \in \mathbb{R}^4 : |\mathbf{k}| = \text{constant} \,\}
$$
with \(Q_c\) as the canonical vertical axis.

**Cross‑links**

x‑sphere, Dual Hyperspheres, FT, Energy Distribution Sphere, Canonical Axes.

**Interpretive Summary**

The k‑sphere represents the child layer’s energy distribution and is the Fourier‑dual of the spatial x‑sphere.  
It is the energetic counterpart of the layer’s geometry, completing the dual‑sphere structure required for the FT and for expressing the layer’s internal physics.



### **Hypersphere (x‑sphere)**

**Definition**

The 3‑sphere representing the child layer’s spatial distribution in the \(x\)-domain.  
It encodes how the child’s geometry occupies space before the Fourier transform is applied.

**Conceptual Role**

The x‑sphere is one half of the dual‑hypersphere structure.  
It is the domain in which the child’s spatial configuration is expressed, with \(Q_c\) serving as the canonical vertical axis.  
The FT maps this sphere into the k‑sphere, turning spatial structure into energetic structure.

**Geometric Expression**

A hypersphere in the spatial domain:
$$
S_x^3 = \{\, \mathbf{x} \in \mathbb{R}^4 : |\mathbf{x}| = \text{constant} \,\}
$$
with \(Q_c\) as the canonical vertical axis.

**Cross‑links**

k‑sphere, Dual Hyperspheres, FT, Canonical Axes, Spatial Distribution Sphere.

**Interpretive Summary**

The x‑sphere represents the child layer’s spatial distribution and forms one side of the dual‑sphere Fourier structure.  
It is the geometric stage on which the child’s spatial configuration lives before being transformed into its energy‑domain counterpart.

