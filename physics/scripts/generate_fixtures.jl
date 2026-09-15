# Regenerates the deterministic reference fixtures under `fixtures/reference/`
# that `web/`'s Vitest suite checks the TypeScript `PhysicsEngine` against.
# Run from the repo root: `julia --project=physics physics/scripts/generate_fixtures.jl`.
#
# JSON keys are camelCase (matching `web/src/lib/physics/types.ts`) even
# though the Julia structs themselves are snake_case — see
# `physics/src/ManifoldLab.jl` for why. Fixtures are pretty-printed so
# `git diff` stays readable if a fixture ever needs to change deliberately.
using ManifoldLab
using JSON

const FIXTURES_DIR = joinpath(@__DIR__, "..", "..", "fixtures", "reference")

function write_fixture(filename, data)
	path = joinpath(FIXTURES_DIR, filename)
	open(path, "w") do io
		JSON.print(io, data, 2)
		write(io, "\n")
	end
	println("wrote ", path)
end

function spectrum_fixture()
	spectrum = kk_spectrum(KKParameters(1.5, 0.2, 4))
	(; radius = spectrum.radius, baseMass = spectrum.base_mass, modes = spectrum.modes)
end

function geodesic_fixture(fiber_momentum)
	geom = GeometryParameters(1.0, 0.5, 1.0)
	initial = InitialState((0.0, 0.0), (1.0, 0.0), fiber_momentum)
	traj = geodesic(initial, geom; t_max = 4.0, n_samples = 20)
	(;
		t = traj.t,
		position = [[p[1], p[2]] for p in traj.position],
		fiber = traj.fiber,
		effectiveCharge = traj.effective_charge
	)
end

write_fixture("kk-spectrum.json", spectrum_fixture())
write_fixture("neutral-geodesic.json", geodesic_fixture(0.0))
write_fixture("positive-p5.json", geodesic_fixture(2.0))
write_fixture("negative-p5.json", geodesic_fixture(-2.0))
