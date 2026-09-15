using Test
using ManifoldLab

@testset "fiber_period" begin
	@test fiber_period(1.0) ≈ 2π
	@test fiber_period(2.0) ≈ 4π
end

@testset "kk_mass / kk_spectrum" begin
	@test kk_mass(0, 0.0, 1.0) == 0.0
	@test kk_mass(1, 0.0, 1.0) ≈ 1.0
	@test kk_mass(2, 0.5, 2.0) ≈ sqrt(0.5^2 + 2^2 / 2.0^2)

	spectrum = kk_spectrum(KKParameters(1.5, 0.2, 4))
	@test length(spectrum.modes) == 5
	@test spectrum.modes[1] ≈ kk_mass(0, 0.2, 1.5)
	@test spectrum.modes[end] ≈ kk_mass(4, 0.2, 1.5)
	@test issorted(spectrum.modes)
end

@testset "effective_field / effective_charge" begin
	field = effective_field(GeometryParameters(1.0, 0.5, 2.0))
	@test field.components == (0.0, 1.0)

	@test effective_charge(0.5, 0.0) == 0.0
	@test effective_charge(0.5, 2.0) == 1.0
	@test effective_charge(0.5, -2.0) == -1.0
end

@testset "geodesic: neutral vs charged" begin
	geom = GeometryParameters(1.0, 0.5, 1.0)

	neutral = geodesic(InitialState((0.0, 0.0), (1.0, 0.0), 0.0), geom)
	@test neutral.effective_charge == 0.0
	# no transverse force => straight line in the second coordinate
	@test all(p -> isapprox(p[2], 0.0; atol = 1e-8), neutral.position)

	positive = geodesic(InitialState((0.0, 0.0), (1.0, 0.0), 2.0), geom)
	@test positive.effective_charge > 0
	@test positive.position[end][2] > 0

	negative = geodesic(InitialState((0.0, 0.0), (1.0, 0.0), -2.0), geom)
	@test negative.effective_charge < 0
	@test negative.position[end][2] < 0

	# matches the closed-form solution for constant acceleration
	q = effective_charge(geom.coupling, 2.0)
	a = q * geom.field_strength
	t_end = positive.t[end]
	expected_x = 0.0 + 1.0 * t_end
	expected_z = 0.0 + 0.0 * t_end + 0.5 * a * t_end^2
	@test positive.position[end][1] ≈ expected_x atol = 1e-6
	@test positive.position[end][2] ≈ expected_z atol = 1e-6
end

@testset "fiber winding" begin
	geom = GeometryParameters(1.0, 0.5, 0.0)
	traj = geodesic(InitialState((0.0, 0.0), (0.0, 0.0), 3.0), geom; t_max = 2.0, n_samples = 5)
	@test all(f -> 0.0 <= f < fiber_period(geom.radius), traj.fiber)
end
