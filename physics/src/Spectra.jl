"""
    kk_spectrum(params::KKParameters) -> KKSpectrum

The Kaluza–Klein mass tower: [`kk_mass`](@ref)`(n, ...)` for `n = 0:max_mode`.
"""
function kk_spectrum(params::KKParameters)
	modes = [kk_mass(n, params.base_mass, params.radius) for n in 0:(params.max_mode)]
	KKSpectrum(params.radius, params.base_mass, modes)
end
