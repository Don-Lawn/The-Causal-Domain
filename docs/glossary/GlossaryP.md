## **P**

### **Parent Layer** (P)

**Definition**  

**P** denotes the **parent layer** in the OP‑stack.  
It is the layer immediately above the current one, providing the inherited Q‑axis \(Q_p\) that defines the observer frame for the child.

**Conceptual Role**  

The parent layer supplies the **only** piece of geometric information that flows downward in the stack:

- the inherited Q‑axis \(Q_p\)

Everything else — phase plane, intrinsic Q‑axis \(Q_c\), dual hyperspheres, local axes — is generated internally by the child.

Thus **P** is not a container or a supervisor; it is simply the **source of the child’s inherited orientation**.

**Geometric Expression**  

The parent’s intrinsic axis becomes the child’s inherited axis:
$$
Q_p = Q_c^{(P)}
$$

**Interpretive Summary**  

**P** identifies the layer above the current one.  
It provides the inherited Q‑axis that defines the observer frame and sets the initial orientation from which alignment, polarisation, and precession are measured.



### **Parent Q‑Axis**

**Definition**  

The intrinsic Q‑axis of the parent layer, denoted \(Q_p\).  
It is the only piece of geometric information passed from the parent to the child, defining the child’s inherited vertical direction.

**Conceptual Role**  

The parent Q‑axis is the **origin of orientation** for the child layer.  
It determines:

- the child’s inherited vertical direction  
- the orientation of the observer frame  
- the reference axis for polarisation  
- the axis around which precession is measured  
- the target axis for alignment  

No other geometric structure is inherited — only this axis.

**Geometric Expression**  

The parent’s intrinsic axis becomes the child’s inherited axis:
$$
Q_p = Q_c^{(\text{parent})}
$$

**Interpretive Summary**  

The parent Q‑axis is the vertical direction handed down from the layer above.  
It defines the observer frame, sets the reference for alignment, and provides the baseline against which the child’s intrinsic Q‑axis is compared.



### **Phase Plane**

**Definition**  

The 2D plane in which the child layer’s phase rotation occurs.  
Its orientation determines the direction of the child’s intrinsic Q‑axis \(Q_c\).

**Conceptual Role**  

The phase plane is the geometric generator of \(Q_c\).  

Its tilt relative to the inherited parent axis \(Q_p\) defines **polarisation**,  
and its precession around \(Q_p\) defines **mass**.  
Every structural feature of the child layer — its axis, its hyperspheres, its FT frame — originates from the orientation of this plane.

**Geometric Expression**  

A plane spanned by two orthonormal basis vectors \((e_1, e_2)\) with normal vector:
$$
Q_c = e_1 \times e_2
$$

**Cross‑links**  

Phase Rotation, \(Q_c\), Polarisation, Precession, Canonical Axes.

**Interpretive Summary**  

The phase plane is the rotating 2D surface whose orientation defines the child’s Q‑axis and whose dynamics encode polarisation and mass.  
Rotate the plane, and you rotate \(Q_c\); precess the plane, and you generate mass; align the plane, and you prepare the layer for the FT.

<figure>
<img src="../figures/Typora/BasicPhaseCircle.png" alt="Basic phase circle" style="zoom:67%;"  />
<figcaption>2D view of the phase plane</figcaption>
</figure>


<figure>
<img src="../figures/Typora/Phase circle with Q vector.png" alt="Basic phase circle" style="zoom:150%;"  />
<figcaption>3D view of the phase plane with Q vector</figcaption>
</figure>



### 

**Definition**  

The 2D coordinate system used to describe orientation and rotation within the child layer’s phase plane.  
It consists of orthogonal axes \(x\) and \(y\), a unit circle, and a unit vector whose angle defines the azimuth \(\phi\).

**Conceptual Role**  

The phase‑plane coordinate system provides the base orientation grammar for the manuscript.  
It establishes:

- the reference direction for azimuth angle \(\phi\)  
- the geometry of the phase circle  
- the projection rules for ortho‑pairs  
- the planar structure from which the intrinsic Q‑axis \(Q_c\) is generated  

It is the simplest and most fundamental coordinate system in the OP‑framework.

**Geometric Expression**  

A 2D orthonormal frame:

- \(x\)-axis (horizontal)  
- \(y\)-axis (vertical)  
- unit circle of radius 1  
- unit vector of magnitude 1  
- azimuth \(\phi\) measured counter‑clockwise from \(x^+\)

**Cross‑links**  

Azimuth Angle \(\phi\), Phase Plane, Ortho‑Pairs, \(Q_c\), Spherical Orientation Triple.

**Interpretive Summary**  

The phase‑plane coordinate system is the reader’s first encounter with the manuscript’s orientation structure.  
It defines pure direction in the phase plane using a unit circle and a unit vector, making \(\phi\) a clean, magnitude‑free measure of planar orientation.  
This coordinate system anchors the geometry from which elevation, phase angle, and the full orientation triple are built.



{ φ‑diagram showing the unit circle, quadrant labels, and the unit vector at angle φ.}

### **Phase Rotation**

**Definition**  

The continuous rotation of the state vector within the child layer’s phase plane.  
It drives the oscillation of the ortho‑pair fields and generates the intrinsic Q‑axis \(Q_c\) as the normal to the rotating plane.

**Conceptual Role**  

Phase rotation is the fundamental dynamical process of the OP‑layer.  

It determines:

- the oscillation of the ortho‑pair fields  
- the orientation of the phase plane  
- the direction of the intrinsic Q‑axis \(Q_c\)  
- the layer’s internal frequency and Tempo  
- the geometric basis for precession (mass)  

Without phase rotation, the layer would have no oscillation, no Q‑axis, and no internal geometry.

**Geometric Expression**  

A rotation of the state vector in the phase plane:
$$
\vec{v}(\phi) = 
\begin{pmatrix}
A\cos\phi \\
A\sin\phi
\end{pmatrix}
$$
with angular parameter \(\phi\) increasing monotonically.

**Cross‑links**  

Phase Plane, Ortho‑Pairs, \(Q_c\), Phase Angle \(\phi\), Tempo \(dt/dT\), Precession.

**Interpretive Summary**  

Phase rotation is the heartbeat of the OP‑layer.  
As the state vector rotates, the ortho‑pair fields oscillate, the phase plane is defined, and the intrinsic Q‑axis emerges as the plane’s normal.  
This single rotation generates the entire internal geometry of the layer.



### **Phase Angle ϕ**

**Definition**  

The internal rotation angle of the state vector within the child layer’s phase plane.  
It specifies the instantaneous position of the rotating state and determines the relative strengths of the ortho‑pair fields.

**Conceptual Role**  

ϕ is the dynamical angle that drives oscillation.  
It determines:

- the instantaneous values of the ortho‑pair fields  
- the position of the state vector on the phase circle  
- the internal timing of the layer’s oscillation  
- the phase relationships between layers  
- the geometric origin of the child’s intrinsic Q‑axis \(Q_c\)  

ϕ is **not** the tilt of the phase plane (polarisation) and **not** the azimuth φ in the XY plane.  
It is the rotation *within* the phase plane itself.

**Geometric Expression**  

A rotation of the state vector in the phase plane:
$$
\vec{v}(\varphi) =
\begin{pmatrix}
A\cos\varphi \\
A\sin\varphi
\end{pmatrix}
$$
with ϕ increasing monotonically as the phase cycle progresses.

**Cross‑links**  

Phase Plane, Phase Rotation, Ortho‑Pairs, Phase Cycle, \(Q_c\), Tempo.

**Interpretive Summary**  

The phase angle ϕ is the internal clock of the OP‑layer.  
As ϕ advances, the ortho‑pair fields oscillate, the state vector traces the phase circle, and the layer experiences its internal cycle of motion.  
ϕ is the purest expression of phase rotation: the angle that turns rotation in the phase plane into oscillation in the observable fields.


### **Phenomenal Domain**

**Definition**  

The domain of observable appearance — the structures, motions, and behaviours that manifest when the causal domain is projected into space.  
It corresponds to the x‑domain, OP₁ behaviour, and the spatial distribution sphere.

**Conceptual Role**  

The phenomenal domain is the layer’s visible surface.  
It expresses:

- oscillation of the ortho‑pair fields  
- spatial distribution on the x‑sphere  
- trajectories, diffraction, and interference  
- the appearance of mass on the shell  
- the observable consequences of phase rotation  

While the causal domain contains the underlying rotational and energetic structure, the phenomenal domain contains **what that structure looks like** when expressed in space.

**Geometric Expression**  

A structure defined in the x‑domain:

- OP₁ behaviour  
- spatial distribution on the x‑sphere  
- projection of causal rotation into observable oscillation  
- mass appearing on the shell  

The phenomenal domain is obtained from the causal domain via the Fourier transform.

**Cross‑links**  

Causal Domain, Cross‑Domain Duality, FT, Spatial Distribution Sphere, Ortho‑Pairs, Oscillation.

**Interpretive Summary**  

The phenomenal domain is the world of appearance — the oscillations, patterns, and spatial structures that arise when the causal domain is projected into space.  

 causal domain is the engine, the phenomenal domain is the display.  
Together they form the dual structure that the Fourier transform connects.

### **Polarisation**

**Definition**  

The angular tilt between the inherited parent Q‑axis \(Q_p\) and the child’s intrinsic Q‑axis \(Q_c\).  
It measures how far the child’s phase plane is tilted relative to the observer frame.

**Conceptual Role**  

Polarisation expresses the **misalignment** between inherited and intrinsic geometry.  
It determines:

- the tilt of the child’s phase plane relative to \(Q_p\)  
- the observer‑dependent distortion of the child’s geometry  
- the need for alignment before applying the FT  
- the amplitude of precession as seen from the parent frame  

Polarisation is not an internal property of the child alone — it is a **relationship** between parent and child.

**Geometric Expression**  

The angle between the two Q‑axes:
$$
\text{polarisation} = \angle(Q_p,\ Q_c)
$$

**Cross‑links**  

\(Q_p\), \(Q_c\), Phase Plane, Precession, Alignment, Observer Frame.

**Interpretive Summary**  

Polarisation is the geometric tilt between inherited and intrinsic axes.  
It encodes how the child’s phase plane appears from the parent’s perspective and determines how much frame rotation is required to align \(Q_p\) with \(Q_c\). 

Once alignment removes this tilt, the child’s geometry becomes canonical for the FT.



### **Precession**

**Definition**  

The rotation of the child’s intrinsic Q‑axis \(Q_c\) around the inherited parent Q‑axis \(Q_p\).  
It is the angular motion that occurs when the phase plane is tilted relative to \(Q_p\), causing \(Q_c\) to sweep out a cone.

**Conceptual Role**  

Precession is the geometric origin of **mass** in the OP‑framework.  
It arises whenever:

- the phase plane is tilted (non‑zero polarisation)  
- the child’s intrinsic axis \(Q_c\) does not coincide with \(Q_p\)  
- the phase rotation has a component orthogonal to the inherited axis  

Precession expresses how the child’s internal rotation appears from the parent’s frame.  
It is an observer‑dependent effect that disappears after alignment.

**Geometric Expression**  

A rotation of \(Q_c\) around \(Q_p\):
$$
Q_c(t) = R_{\!Q_p}(\omega_{\text{prec}}\, t)\, Q_c(0)
$$
where \(\omega_{\text{prec}}\) is the precession rate.

**Cross‑links**  

Polarisation, \(Q_p\), \(Q_c\), Phase Plane, Mass, Alignment, Observer Frame.

**Interpretive Summary**  

Precession is the conical motion of the child’s intrinsic axis around the inherited axis.  
It is the geometric signature of mass: when the phase plane is tilted, the internal rotation has a component that causes \(Q_c\) to circle around \(Q_p\).  
Alignment removes this observer‑dependent motion, revealing the child’s canonical geometry.



### **Projection**

---

#### **1. Geometric Projection (Rotation → Axis → Waveform)**

**Definition**  

The projection of a rotating state vector in the phase plane onto a linear axis, producing an oscillating waveform.  
This is the geometric origin of sine and cosine.

**Conceptual Role**  

Geometric projection shows how **rotation becomes oscillation**.  
A circular motion in the phase plane produces sinusoidal behaviour when viewed along an axis.  
This concept underlies phase, frequency, Ω‑vector construction, and the Fourier transform.

**Geometric Expression**  

A unit vector rotates in the phase plane; its projection onto the vertical axis oscillates with angle \(\phi\):

- rotation → circular motion  
- projection → sinusoid  
- \(\phi\) determines instantaneous value  

**Cross‑links**  

Phase Plane, Ortho‑Pairs, Phase Angle \(\phi\), Fourier Projection, FT.

**Interpretive Summary**  

A rotating vector projected onto an axis produces a sinusoid.  
This simple geometric fact is the seed of the entire OP‑framework: oscillation is the **umbra**—the shadow—of rotation.

**Diagram Placeholder**  

![Projections of the Model](F:/Projects/Physics/Relativity/MyRelativity/figures/Section 2.  Solution/Projections of the Model.png)

---

#### **2. Fourier Projection (Projection onto Sine/Cosine Basis)**

**Definition**  

The decomposition of a function by projecting it onto a family of rotating vectors — the sine and cosine basis functions.

**Conceptual Role**  

Fourier projection generalises geometric projection from a single axis to an entire **orthogonal basis of rotations**.  
Each sinusoid corresponds to a rotation at a specific frequency.  
The FT is therefore a projection onto circular motions.

**Geometric Expression**  

Projection onto the orthogonal basis:

- rotation at frequency \(f\) → basis vector  
- projection onto that rotation → Fourier coefficient  

**Cross‑links**  

FT, Dual Hyperspheres, Phase Rotation, Energy–Space Duality, Ω‑Vector.

**Interpretive Summary**  

The Fourier transform is just projection — but onto *many* rotations instead of one.  
This connects the simple geometric projection diagram to the full machinery of the OP‑model: phase rotation, Q‑axis generation, dual spheres, and the layer‑local FT.