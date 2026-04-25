# Glossary

## A

### Alignment (Canonical Alignment)

**Definition**

 A rotation of the observer frame so that the **parent Q‑axis \((Q_p)\)** is brought into coincidence with the **child’s intrinsic Q‑axis \(Q_𝚌\)**.

**Conceptual Role**

 Removes *polarisation tilt* (the angle between \(Q_p\)and \(Q_c\)) while preserving *precession* (rotation of \(Q_c\) around\(Q_p\)).
 This produces a clean, canonical coordinate system in which the Fourier transform can operate without cross‑terms.

**Geometric Expression**

 A rotation in the orientation sphere that maps:
$$
Qₚ\rightarrow Q𝚌
$$


so that the phase plane becomes orthogonal to the aligned Q‑axis.

**Cross‑links**

 Polarisation,\(Q_p\), \(Q_c\), Precession, FT, Observer Frame.

**Interpretive Summary**

 Alignment is the process of removing observer‑dependent tilt so that the child’s geometry becomes canonical.





### Axis Conversion

**Definition**

 A coordinate transformation applied when the child’s geometry is expressed in a non‑canonical frame.
 It re‑expresses the child’s phase plane, Q‑axis, and hyperspheres in the aligned coordinate system.

**Conceptual Role**

 Axis conversion is required *only if* the observer frame is misaligned with the child’s intrinsic geometry.
 Once alignment is performed, axis conversion becomes trivial or unnecessary.

**Geometric Expression**

 A mapping from the observer’s coordinates \((x_p,k_p,Q_p)\) to the child’s canonical coordinates \((x_𝚌,k_𝚌,Q_𝚌)\).

**Cross‑links**

 Alignment, Canonical Axes, Polarisation, FT.

**Interpretive Summary**

 Axis conversion ensures that the child’s geometry is expressed in the correct frame before applying the FT.



### Axial Inheritance (Parent → Child)

**Definition**

 The rule that each layer inherits a **parent Q‑axis \((Q_p)\)** from the layer above it.
 This inherited axis defines the observer frame for the child.

**Conceptual Role**

 Axial inheritance provides the child with its initial vertical direction.
 The child then generates its own intrinsic Q‑axis (\(Q_c\)) from its phase rotation.
 The relationship between \(Q_p\) and \(Q_c\) determines polarisation and precession.

**Geometric Expression**

Parent layer provides \(Q_p\).
 Child layer generates \(Q_c\).
 The tilt between them defines the child’s orientation state.

**Cross‑links**

Q_p\), \(Q_c\), Polarisation, Precession, Layer Inheritance.

**Interpretive Summary**

 Axial inheritance establishes the observer frame for each layer and sets the stage for polarisation and alignment.





### **Azimuth Angle φ**

**Definition**

 The planar orientation angle measured in the child layer’s XY phase‑plane. It specifies the counter‑clockwise rotation of a unit vector around the origin, starting from the positive x‑axis.

**Conceptual Role**

 Azimuth φ is the reader’s first encounter with the manuscript’s orientation grammar. It establishes the base direction in the phase plane from which elevation θ and phase angle ϕ are defined. φ also determines how the child’s phase rotation projects into the XY plane and how the orientation triple \((\phi ,\theta ,\varphi )\) is constructed.

**Geometric Expression**

Unit circle of radius 1

- Unit vector of magnitude 1
- φ measured CCW from \(x^+\)
- Quadrants: \(x^+,x^-,y^+,y^-\)

**Cross‑links**

 Phase‑Plane Coordinate System, Elevation Angle θ, Phase Angle ϕ, Spherical Orientation Triple, Ω‑Vector, Q‑Axis.

**Interpretive Summary**

 Azimuth φ is the simplest orientation angle in the manuscript: the direction of a unit vector in the XY phase‑plane. Because both the circle and the vector are normalised, φ expresses pure direction rather than magnitude. It provides the foundational orientation from which elevation and phase angles are built, and it anchors the reader’s understanding of how the child’s geometry rotates around the Q‑axis.

**Diagram Placeholder**

<img src="F:/Projects/Physics/Relativity/MyRelativity/figures/Section 2.  Solution/Phase‑Plane Coordinate System.png" alt="Phase‑Plane Coordinate System" style="zoom: 67%;" />

