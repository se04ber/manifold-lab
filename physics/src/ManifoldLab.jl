"""
    ManifoldLab

Reference implementation for Manifold Lab's Kaluza–Klein toy models —
the scientific source of truth behind the web app's TypeScript physics
engine.

Units: everything is dimensionless. Lengths (radius) are expressed
relative to a reference compactification radius R0 = 1; masses and
momenta are expressed in units of 1/R0; ħ = c = 1. This convention must
stay in lockstep with `web/src/lib/physics/types.ts` — the fixtures
under `fixtures/reference/` are what enforce that agreement in CI.

Field names here are idiomatic Julia (snake_case); the same concepts
appear camelCase on the TypeScript side. The JSON fixtures are the
actual point of agreement between the two — see `physics/scripts/generate_fixtures.jl`.
"""
module ManifoldLab

export SimulationParameters,
	KKParameters,
	KKSpectrum,
	GeometryParameters,
	InitialState,
	Trajectory,
	EffectiveField,
	ReferenceScenario

"Everything a UI control panel can vary; the single source of truth for one experiment's state."
struct SimulationParameters
	radius::Float64
	coupling::Float64
	hidden_momentum::Float64
	mode::Int
	field_strength::Float64
	initial_velocity::NTuple{2,Float64}
	simulation_speed::Float64
end

struct KKParameters
	radius::Float64
	base_mass::Float64
	max_mode::Int
end

"m_n for n = 0..max_mode, i.e. modes[n+1] = sqrt(base_mass^2 + n^2 / radius^2)."
struct KKSpectrum
	radius::Float64
	base_mass::Float64
	modes::Vector{Float64}
end

struct GeometryParameters
	radius::Float64
	coupling::Float64
	field_strength::Float64
end

"A point in the higher-dimensional base spacetime plus the compact fiber momentum p5."
struct InitialState
	position::NTuple{2,Float64}
	velocity::NTuple{2,Float64}
	fiber_momentum::Float64
end

struct Trajectory
	t::Vector{Float64}
	position::Vector{NTuple{2,Float64}}
	fiber::Vector{Float64}
	effective_charge::Float64
end

"The effective gauge connection A_mu induced by the geometry, per the metric
ansatz ds^2 = g_{mu nu} dx^mu dx^nu + R^2 (dy + kappa A_mu dx^mu)^2."
struct EffectiveField
	radius::Float64
	coupling::Float64
	components::NTuple{2,Float64}
end

struct ReferenceScenario
	name::String
	params::SimulationParameters
end

end # module ManifoldLab
