# Part 1 — An Alternate View of Special Relativity

## Abstract

Prioritising the observed length reduction at relativistic speeds over the time‑dilation effects leads to an alternate interpretation of relativistic mathematics. This interpretation removes the need for relativistic mass increase and instead treats the apparent mass change as a geometric artefact of rotation into an imaginary dimension.

## Background

Einsteinian special relativity provides the standard framework for understanding the behaviour of objects travelling at relativistic speeds. The traditional interpretation emphasises time dilation, length contraction, and relativistic mass increase as consequences of the Lorentz transformation.

## Introduction

Following tradition, this examination of special relativity begins with a thought experiment. There is little new mathematics; instead, the focus is on interpreting the existing mathematics in terms of real‑world effects.

We consider a spaceship, the *Traveller* (subscript \( t \)), capable of travelling near the speed of light relative to its starting point. The Traveller is observed by the *Observer* (subscript \( o \)), who remains stationary relative to the Traveller’s point of origin.

The Traveller accelerates at a constant \( 9.8\,\text{m/s}^2 \).

From the Traveller’s perspective, all behaviour remains consistent with Newtonian mechanics:

- constant acceleration  
- steadily increasing velocity  
- no speed limit at \( c \)  
- no length contraction  
- no mass increase  
- no time dilation  

All relativistic effects appear only to the stationary Observer.

## Key

Throughout this document:

- Subscript \( o \) refers to quantities as measured by the stationary observer.
- Subscript \( t \) refers to quantities as measured by the Traveller, who accelerates and decelerates and appears distorted to the observer.

The Traveller observes Newtonian behaviour in his own frame:

- no speed limit at \( c \)
- no length contraction
- no mass increase
- no time dilation

All relativistic effects arise only in the observer’s frame.

![A graphical representation of the Traveller accelerating at a constant acceleration of 1g (9.8 m/s²).](../figures/TravellersObservationOfVelocity.png){#fig:TravellersObservationOfVelocity}

## Rotational Special Relativity

We begin by noting that the reciprocal of the Lorentz factor is the equation of a circle.

The Lorentz factor is:

$$
\gamma = \frac{1}{\sqrt{1 - v_o^2 / c^2}}
\label{eq:lorentzFactor}
$$

Define the distortion factor \( \phi \) as:

$$
\phi = \frac{1}{\gamma}
$$

![Figure for Eqn \eqref{eq:ThetaIsInverseOfGamma}.  
Inverting Lorentz's distortion factor gives a new one with more interesting geometry.](../figures/ThetaIsInverseOfGamma.png){#fig:ThetaIsInverseOfGamma}

Setting \( c = 1 \) for natural units simplifies this to:

$$
\phi = \sqrt{1 - v_o^2}
\label{eq:ThetaIsInverseOfGamma}
$$

<center>See Figure @fig:ThetaIsInverseOfGamma.</center>

From the definition of \( \phi \), we can introduce an imaginary pseudo‑spatial dimension \( q \).  
This dimension forms an orthogonal axis to reality, in this case \( v_o \), allowing us to represent relativistic distortion as a rotation in the \( v\text{–}q \) plane.

We define \( q \) through the unit‑circle identity:

$$
q = \sqrt{1 - \phi^2}
\label{eq:qDef}
$$

This establishes a geometric relationship between the distortion factor \( \phi \), the imaginary displacement \( q \), and the rotation angle \( \theta \):

$$
\phi = \cos\theta, \qquad q = \sin\theta
\label{eq:angleDef}
$$

The Traveller’s proper length (of spaceship) remains constant:

$$
l_t = \sqrt{l_o^2 + l_q^2}
\label{eq:lengthConst}
$$

while the Observer measures only the projection onto the \( \phi \)-axis:

$$
l_o = l_t \, \phi
\label{eq:lengthProjection}
$$

At rest:

- \( v_o = 0 \)
- \( \phi = 1 \)
- \( q = 0 \)
- \( \theta = 0 \)

and both frames agree on the length.

## Basic Length Shrinkage

### Examination of apparent length reduction

#### The Spaceship at Rest

Consider the Traveller’s spaceship represented by a unit vector of length \( l_t = 1 \).  
In the Traveller’s Newtonian frame this length never changes.

In the Observer’s relativistic frame, the apparent length is the projection of this vector onto the \( \phi \)-axis:

$$
l_o = l_t \, \phi = l_t \cos\theta
\label{eq:lengthProjectionRest}
$$

![Figure for \eqref{eq:SpaceshipAtRest}.  
The spaceship at rest lies along the real axis, with no presence in the Q dimension.](../figures/SpaceshipAtRest.png){#fig:SpaceshipAtRest}

$$
v_o = 0, \qquad
\phi = 1, \qquad
q = 0, \qquad
l_t = l_o = 1
\label{eq:SpaceshipAtRest}
$$

### The Spaceship at \( v_o = \frac{c}{\sqrt{2}} \)

As velocity increases, \( \phi \) decreases, and the observed length contracts accordingly.

![Spaceship at \( v_o = \frac{c}{\sqrt{2}} \), giving a 45° rotation into the Q dimension, and an \( l_o \) reduced by \( \frac{1}{\sqrt{2}} \).](../figures/SpaceshipHalfRotated.png){#fig:SpaceShipHalfRotated}

- \( \phi \) is now the horizontal axis, indicating length reduction as a function of rotation into the Q axis.  
- The \( q \)-axis is vertical.  
- The Traveller sees his usual length of 1 unit.  
- The projection onto the \( \phi \)-axis shows the reduced length seen by the Observer.  
- The rotation angle is \( \theta = 45^\circ \).  
- The correct relationships are \( \phi = \cos\theta \) and \( q = \sin\theta \).

Our observables are now:

- \( v_o = \frac{c}{\sqrt{2}} \)
- \( \phi = \frac{1}{\sqrt{2}} \)
- \( q = \frac{1}{\sqrt{2}} \)
- The Traveller and Observer disagree on the length.

Thus, the notion of rotation into the Q dimension, as a result of velocity caused by acceleration, is mathematically identical to Lorentz’s length‑contraction equation.  
However, the addition of an imaginary dimension allows a more natural visualisation of the Traveller rotating away from the Observer’s reality.

Naturally, the Traveller may observe an identical ratio of length‑reduction in the Observer.

### The Spaceship at Near‑\( c \)

![Spaceship near \( c \). The ship is nearly fully rotated into Q and shows extreme length shrinkage.](../figures/ShipNearC.png){#fig:ShipNearC}

This rotation indicates that the ship is approaching the hard limit of \( c \).

Its length appears to the Observer to be greatly reduced, close to zero.  
Again, this rotational concept gives a simple geometric model that shows how both Traveller and Observer can be correct at the same time.

## The Monorail

At this point, note that there is no leeway in this mathematics.  
The velocity \( v_o \) determines \( \phi \) and \( \theta \) exactly, so it appears as if our spaceship is on rails, much like Einstein’s train analogy—except that normal train tracks are fixed in position, whereas ours is fixed in velocity/Q‑space.

Let us refer to this single path in velocity space as **the monorail**.

It also appears that, in velocity space, the monorail runs along one quadrant of a circle.  
Velocity space is circular: the monorail curves away from reality into the imaginary \( q \) dimension as velocity increases.

---

### Deriving the Shape of the Monorail

We know the rotation angle \( \theta \) of the spaceship at any given velocity.  
If the ship must follow the monorail without yawing across it, then the rail must be the **accumulation (integral)** of these rotations.

Start with:

$$
\frac{dq}{dv} = \tan\!\left(\arccos\!\left(\sqrt{1 - v_o^2}\right)\right)
\label{eq:monorailDerivative}
$$

Using trigonometric identities:

$$
\theta = \arccos\!\left(\sqrt{1 - v_o^2}\right)
$$

Thus:

$$
\cos\theta = \sqrt{1 - v_o^2}
$$

and the corrected identity:

$$
\sin\theta = v_o
$$

Therefore:

$$
\tan\theta = \frac{\sin\theta}{\cos\theta}
           = \frac{v_o}{\sqrt{1 - v_o^2}}
$$

So the differential equation becomes:

$$
\frac{dq}{dv} = \frac{v}{\sqrt{1 - v^2}}
\label{eq:monorailDiffSimplified}
$$

Let:

$$
u = 1 - v^2
$$

Then:

$$
du = -2v\,dv
$$

Thus:

$$
\int \frac{v}{\sqrt{1 - v^2}}\, dv
= -\frac{1}{2} \int \frac{1}{\sqrt{u}}\, du
= -\sqrt{u} + C
$$

Substituting back:

$$
q(v) = -\sqrt{1 - v^2} + C
$$

We choose the **positive** square root to place the curve in the correct physical quadrant:

$$
q(v) = \sqrt{1 - v^2} + C
$$

At \( v = 0 \), the ship is aligned with the real axis, so \( q = 0 \).  
Thus:

$$
q(v) = \sqrt{1 - v^2}
\label{eq:monorail}
$$

This is the equation of a **quarter circle**.

---

<img src="../figures/Monorail.png" alt="Figure for \eqref{eq:monorail}.  
This graph shows the circular nature of the monorail.  
The Traveller at 0.8c has a Q‑dimension displacement represented by the red arrow, tangent to the monorail." style="zoom: 80%;" />

As the Traveller increases speed, he moves along the monorail toward its endpoint at \( (1, 1) \).  
He can never reach the end, because his time dilates, making the approach take infinite time from the Observer’s viewpoint.

Naturally, the Traveller sees only his familiar Newtonian space, unaware that he is approaching a singularity at \( v = c \).

## Vectors

The distance (or “depth”) into the Q dimension is tightly coupled to the rotation angle \( \theta \) and the distortion factor \( \phi \). By applying standard vector‑translation rules, we can translate the vector representing the Traveller’s rotation so that its tail lies at the origin of the circular diagram. This allows us to treat the rotated velocity vector as a **state vector**.

A state vector encodes:

- the Traveller’s rotation angle \( \theta \)  
- the corresponding distortion factor \( \phi = \cos\theta \)  
- the imaginary displacement \( q = \sin\theta \)  

This gives a compact geometric representation of the Traveller’s relativistic state.

---

<img src="../figures/TranslatedStateVector.png" alt="A diagram showing how the Traveller’s vector of motion in the v–q dimension is translated to become a q‑state vector on the rotation diagram." style="zoom: 43%;" />

The diagram on the right is in \( q(v) \) coordinates, commonly referred to as a **circle diagram**.

This representation allows us to plot state vectors for multiple objects on the same chart.  
It also marks our first step into using vector methods for this relativistic geometry.

---

<img src="../figures/TwoTravellers.png" alt="Rotation State Diagram of Two Travellers at different velocities, showing the angle of interest between their state vectors." style="zoom:48%;" />

The Rotation State Diagram has been dimensionally reduced by aligning the direction of travel with the horizontal \( v_x \) axis. In more complex scenarios, we can add coordinates \( v_y \) and \( v_z \) to the state vector, expanding the model to **three spatial velocity components plus one Q component**.

In that case, the circle generalises to a **hypersphere** with:

- three real velocity axes \(v_x,v_y,v_z\)
- one imaginary axis q

All four components satisfy:
$$
v_x^2 + v_y^2 + v_z^2 + q^2 = 1
$$
This is the natural extension of the unit circle to four dimensions.

Once embedded in the hypersphere, the individual axes lose their privileged status. The state vector becomes a direction in a unified space, and the choice of which axis to call v_x or q is a matter of reference, not physics. Every observer lives on the surface of the hypersphere, and their state is defined only by orientation — not by position or magnitude. There is no central axis, no preferred frame, no king at the round table. All directions are equal, and all observers are both travellers and reference frames.

---

### Relative Dilation Between Travellers

If we wish to find the relative dilation between two Travellers, we simply take the **dot product** of their 4‑D state vectors.  
Because each state vector has unit length, the dot product automatically gives:

- the cosine of the angle between them  
- which corresponds to the relative distortion factor  
- which determines how each Traveller sees the other’s time and length

Thus:

- The dot product encodes the **relative Lorentz factor**.  
- The geometry provides the **cos θ** projection automatically.  
- No additional machinery is required.

This vector‑based interpretation unifies:

- length contraction  
- time dilation  
- relative velocity  
- and relativistic composition  

into a single geometric object.

## Mass Increase

### Traditional Approach

Experimental observations indicate that objects travelling near \( c \) react sluggishly to forces applied to them.  
The standard interpretation begins with Newton’s second law:

$$
f = m a
$$

If the same force produces a smaller acceleration, then the mass must have increased.  
This leads to the traditional relativistic mass formula:

$$
m_o
= \frac{m_t}{\cos\theta}
= \frac{m_t}{\phi}
= \frac{m_t}{\sqrt{1 - \frac{v_o^2}{c^2}}}
= \gamma m_t
\label{eq:TraditionalMassIncrease}
$$

### Q‑Dimension Approach

Equation \eqref{eq:TraditionalMassIncrease} assumes that the force and the acceleration are aligned along the same vector.  
But in our two‑dimensional \( v\text{–}q \) model, misalignment is not only possible — it is inevitable.

For any given velocity \( v \), the Traveller’s state vector is rotated by an angle \( \theta \).  
The monorail determines the direction of allowed acceleration in velocity space.

---

## External (Real‑Axis) Force

![Figure for equation \eqref{eq:effectiveForce}.  
Forces such as drag, or a push applied by the environment, suffer a \(\cos\theta\) reduction.](../figures/MassIncreaseExternal.png){#fig:MassIncreaseExternal}

An external braking force (purple) is applied to the Traveller.  
This force lies entirely along the real (horizontal) axis.

However:

- Part of the force points **across** the monorail (green).  
- Only the component **along** the monorail (blue) produces acceleration.  
- The monorail dictates the allowed direction of motion in velocity space.

Thus the effective force is reduced by the projection factor \( \cos\theta \):

$$
f_e = f \cos\theta
\label{eq:effectiveForce}
$$

<center>See Figure @fig:MassIncreaseExternal.</center>

---

## Local (Ship‑Generated) Force

![Figure for equation \eqref{eq:effectiveThrust}.  
Forces such as thrust, applied by the ship itself, also suffer a \(\cos\theta\) reduction.](../figures/EffectiveThrust.png){#fig:effectiveThrust}

If the thrust is generated by the Traveller’s ship, then it is applied **in the ship’s rotated frame**, not the Observer’s.

Thus:

- The thrust vector is angled relative to the Observer’s real axis.  
- The monorail again determines the direction of allowed acceleration.  
- The effective thrust is the dot‑product projection onto the real axis.

Therefore:

$$
f_e = f \cos\theta
\label{eq:effectiveThrust}
$$

<center>See Figure @fig:effectiveThrust.</center>

The remaining component of thrust accelerates the Traveller deeper into the Q dimension, but this is largely compensated by time‑dilation effects.

---

## Summary

In both external and internal cases, the Traveller becomes less sensitive to applied forces as seen by the Observer.  
This behaviour can be interpreted as an **effective increase in mass**, but doing so requires treating mass as velocity‑dependent — a concept that becomes awkward when different observers disagree on the amount of “mass increase.”

The rotational approach provides a cleaner explanation:

- The Traveller’s state vector rotates into the Q dimension.  
- Forces applied in the Observer’s frame are misaligned with the monorail.  
- Only the \( \cos\theta \) component contributes to real‑axis acceleration.  
- The reduced acceleration mimics an increase in mass.  

Thus, relativistic mass increase is not a physical accumulation of mass, but a **geometric projection effect** arising from rotation in the \( v\text{–}q \) plane.

We define the phase angle \( \theta \) as the rotation of a Traveller’s state vector in this plane.  
Two Travellers differ by a phase offset \( \Delta\theta \), which represents their relative dilation.  
Light occupies the limiting case \( \theta = 90^\circ \), and is therefore \( 90^\circ \) out of phase with all matter.

## Time Dilation

Time dilation follows just as naturally from this geometry. A photon clock placed anywhere around the rotation‑state diagram traces a longer path as the state vector rotates, reproducing the familiar dilation factor with no additional assumptions.