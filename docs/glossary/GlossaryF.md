

## **F**

### **Fourier Transform (Layer‑Local FT)**

**Definition**

A transform that maps the child layer’s spatial distribution (x‑sphere) to its energy distribution (k‑sphere), using the child’s intrinsic Q‑axis \(Q_c\) as the canonical vertical axis.

**Conceptual Role**

The FT is the bridge between the two hyperspheres.  
It operates **only within a single layer**, because it requires:

- canonical axes  
- aligned \(Q_p \rightarrow Q_c\)  
- no polarisation tilt  
- clean separation of spatial and energy domains  

The FT cannot act across layers because each layer has its own \(Q_c\), its own geometry, and its own dual hyperspheres.

**Geometric Expression**

A dual mapping:
$$
\mathcal{F} : S_x^3 \;\longrightarrow\; S_k^3
$$
performed in the canonical frame where \(Q_c\) is vertical.

**Cross‑links**

Canonical Axes, \(Q_c\), Alignment, Dual Hyperspheres, Cross‑Domain Duality, Layer Isolation.

**Interpretive Summary**

The Fourier transform maps the child’s spatial sphere to its energy sphere, but only after the axes are aligned so that \(Q_p\) coincides with \(Q_c\).  
This ensures that the FT sees a clean, canonical geometry with no observer‑dependent distortions, preserving the integrity of the dual‑hypersphere structure.



### **Frame Rotation (Observer Rotation)**

**Definition**

A rotation of the observer’s coordinate system around the orientation sphere, used to align the inherited parent Q‑axis \(Q_p\) with the child’s intrinsic Q‑axis \(Q_c\).

**Conceptual Role**

Frame rotation is the mechanism behind **alignment**.  
It removes the observer‑dependent component of polarisation by rotating the *observer’s frame* rather than the child’s geometry.  
This ensures that the Fourier transform sees a clean canonical configuration with no tilt between \(Q_p\) and \(Q_c\).

**Geometric Expression**

A rotation in \(\mathrm{SO}(3)\) acting on the observer frame:
$$
(x_p,\ k_p,\ Q_p) \;\mapsto\; (x',\ k',\ Q_c)
$$

**Cross‑links**

Alignment, \(Q_p\), \(Q_c\), Polarisation, Axis Conversion, Observer Frame.

**Interpretive Summary**

Frame rotation is the observer’s adjustment that brings \(Q_p\) into alignment with \(Q_c\).  
By eliminating polarisation tilt at the frame level, it allows the child’s intrinsic geometry to be expressed cleanly and prepares the layer for the FT, which requires canonical axes.