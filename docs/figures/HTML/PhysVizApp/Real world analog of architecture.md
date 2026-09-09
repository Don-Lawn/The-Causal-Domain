RR Engine Architecture Summary (MVC + POV + FSM)
1. ObjectFSM → Actor (Model)
Represents the semantic object.

Handles local physics and behaviour: rotation, pulse, colour, scale, momentum.

Continues animating unless directed otherwise.

Independent performer inside the world.

2. DomainFSM → Director (Controller)
Orchestrates the global choreography of the scene.

Controls object movement, timing, transitions, relationships, tempo, phase.

Issues commands to the camera (pvCamera + CameraFSM).

The “director” of the entire domain.

3. CameraFSM → Cameraman Behaviour (POV Brain)
Controls what the cameraman is doing.

States include:

ON / OFF

LIFTING

ZOOMING

ROLLING

PANNING

TILTING

TRAVERSING / DOLLYING

ORBITING

TRACKING

LOCKED

RESETTING

Remembers and sustains actions until completion.

Example trigger: Zoom in at 3 units/sec for 5 units.

4. pvCamera → Camera Rig (POV Device)
The physical camera inside the world.

Stores position, orientation, radius, tilt, follow target, Z‑tracking.

Executes movement instructions from CameraFSM.

“Move the camera here and look at this.”

5. RendererFSM → Lens & Processing (View Logic)
Controls how the camera sees, not how it moves.

Applies optical and atmospheric effects:

bloom

fog

distortion

colour grading

tone mapping

domain‑specific style

The “costume, makeup, lighting” department.

6. Render Hints → Appearance Instructions
Parameters describing how the renderer should style the object.

Not movement, not physics — purely visual.

Domain‑sensitive: different domains produce different looks.

7. Rendered View → Final Output (View)
The final image produced by the renderer.

Combines:

ObjectFSM physics

DomainFSM choreography

CameraFSM behaviour

pvCamera position/orientation

RendererFSM appearance

Render hints

Layer Summary
Model → ObjectFSM (Actor)

Controller → DomainFSM (Director)

POV → CameraFSM + pvCamera (Cameraman + Camera Rig)

View → Rendered Output

Renderer → Lens & Processing

Render Hints → Appearance Instructions