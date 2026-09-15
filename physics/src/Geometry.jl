"""
    fiber_period(radius)

The period of the compact fiber coordinate y under the identification
y ~ y + 2πR that defines S¹ compactification, and thus the Kaluza–Klein
metric ansatz

    ds² = g_μν dx^μ dx^ν + R² (dy + κ A_μ dx^μ)²
"""
fiber_period(radius::Real) = 2π * radius
