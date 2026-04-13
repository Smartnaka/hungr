# UI Audit (Guideline-Based)

## Violations Found

1. **HomeScreen / primary interactions use `TouchableOpacity` without explicit 44x44 guarantees.**
   - Elements: favorites toggle, action chips, swipe remove controls.
   - Violation: touch targets can drop below minimum in dense rows.
   - Guideline refs: Section 7.2 and Section 17.1 (minimum 44×44 touch target).

2. **HomeScreen / inconsistent spacing values and hierarchy drift.**
   - Elements: mixed section gaps (8, 10, 12, 16) and ad-hoc placement around card/actions.
   - Violation: spacing is not fully controlled by the documented 4pt system.
   - Guideline refs: Section 3.1 (4pt soft grid), Section 12.2 (section spacing > within-section spacing).

3. **App and component colors are hardcoded and not tokenized.**
   - Elements: repeated literals (`#FF6B35`, `#1A1A2E`, `#000`, etc.).
   - Violation: no complete tokenized palette with semantic roles.
   - Guideline refs: Section 5.2 (build full palette + assign use cases), Section 5.3 (avoid pure black).

4. **Typography scale is inconsistent with accessibility-first hierarchy.**
   - Elements: tiny labels and toasts at 11–14 with mixed weights and ad-hoc line heights.
   - Violation: not anchored to fixed type roles and line-height rules.
   - Guideline refs: Section 4.2 (fixed type scale), Section 4.3 (line-height, alignment, readability), Section 17.3.

5. **Shadows use pure black and vary by component.**
   - Elements: cards/buttons (`shadowColor: '#000'`).
   - Violation: shadow color and softness not systemized.
   - Guideline refs: Section 6.2 (non-black, soft shadow, low opacity).

6. **State coverage gaps for data/interaction UX.**
   - Elements: suggestion flow and favorites list.
   - Violation: no skeleton loading state and limited explicit system-error recovery UI.
   - Guideline refs: Section 16.3 (skeleton loading), Section 8.2 (design all states), Section 17.5 (error recovery).

7. **Accessibility metadata is incomplete.**
   - Elements: interactive controls lacked explicit labels/roles in several places.
   - Violation: screen-reader support not consistently applied.
   - Guideline refs: Section 17.4 (accessibility labels on interactive elements).
