"""
    effective_field(params::GeometryParameters) -> EffectiveField

Reads off the effective lower-dimensional gauge field implied by the
Kaluza–Klein metric ansatz (see [`fiber_period`](@ref)): the off-diagonal
metric components g_{μ5} become A_μ. This toy model doesn't solve for a
curved g_μν; instead `field_strength` directly parameterizes a schematic,
spatially uniform A_μ = (0, κ·field_strength) on the 2D base — enough to
show the geometry → gauge-field correspondence without claiming a full
solution of the higher-dimensional Einstein equations.
"""
function effective_field(params::GeometryParameters)
	components = (0.0, params.coupling * params.field_strength)
	EffectiveField(params.radius, params.coupling, components)
end

"""
    kk_mass(n, base_mass, radius)

The n-th Kaluza–Klein mode mass, `m_n = sqrt(base_mass^2 + n^2/radius^2)`,
from quantizing momentum around the compact fiber in integer units of 1/R.
"""
kk_mass(n::Integer, base_mass::Real, radius::Real) = sqrt(base_mass^2 + n^2 / radius^2)

"""
    effective_charge(coupling, fiber_momentum)

Momentum along the compact fiber looks like electric charge to a
lower-dimensional observer: `q = κ·p₅`.
"""
effective_charge(coupling::Real, fiber_momentum::Real) = coupling * fiber_momentum
