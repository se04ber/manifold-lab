using OrdinaryDiffEq

"""
    geodesic(initial::InitialState, params::GeometryParameters; t_max=4.0, n_samples=120) -> Trajectory

Integrates the visible (base-space) part of a higher-dimensional free
trajectory under the effective field from [`effective_field`](@ref).

This toy model doesn't derive the equation of motion from a curved
higher-dimensional metric; it uses the reduced-theory result directly: a
particle with fiber momentum p₅ acquires effective charge
`q = κ·p₅` (see [`effective_charge`](@ref)), and in the schematic uniform
field `A = (0, κ·field_strength)` that charge feels a constant force along
the second base coordinate — the Kaluza–Klein analogue of the Lorentz
force law. `Tsit5` is SciML's recommended default for this kind of
non-stiff ODE; the equation of motion is linear enough to also have a
closed form, which `test/runtests.jl` checks the integrator against.

The fiber coordinate isn't part of the ODE state — free motion along a
flat fiber direction is just `y(t) = y0 + p5·t`, wrapped by
[`fiber_period`](@ref).
"""
function geodesic(
	initial::InitialState, params::GeometryParameters; t_max::Real = 4.0, n_samples::Integer = 120
)
	q = effective_charge(params.coupling, initial.fiber_momentum)
	acceleration = (0.0, q * params.field_strength)

	function rhs!(du, u, _p, _t)
		du[1] = u[3]
		du[2] = u[4]
		du[3] = acceleration[1]
		du[4] = acceleration[2]
	end

	u0 = [initial.position[1], initial.position[2], initial.velocity[1], initial.velocity[2]]
	problem = ODEProblem(rhs!, u0, (0.0, t_max))
	solution = solve(problem, Tsit5(); saveat = range(0.0, t_max; length = n_samples))

	period = fiber_period(params.radius)
	t = collect(solution.t)
	position = [(u[1], u[2]) for u in solution.u]
	fiber = [mod(0.0 + initial.fiber_momentum * τ, period) for τ in t]

	Trajectory(t, position, fiber, q)
end
