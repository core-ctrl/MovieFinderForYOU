# TODO: Disable Google & GitHub Sign-In (Show as Coming Soon)

## Files to Edit
- [x] `components/AuthWidget.jsx`
- [x] `components/AuthModal.jsx`
- [x] `pages/login.js`

## Plan
1. Update `SocialButton` in `AuthWidget.jsx` to support a `disabled` prop with reduced opacity, `cursor-not-allowed`, and a "Coming Soon" badge.
2. Set `disabled={true}` on both Google and GitHub buttons inside `AuthWidget.jsx`.
3. Apply the same disabled "Coming Soon" treatment to `AuthModal.jsx`.
4. Replace the plain text in `pages/login.js` with two disabled Coming Soon buttons (Google & GitHub) matching the widget style.

## Status
All changes applied successfully.

