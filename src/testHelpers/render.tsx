import { Router, Routes, Route } from '@solidjs/router'
import { render, fireEvent } from '@solidjs/testing-library'
import { Component } from 'solid-js'

export type renderOptions = any

export const renderTest = (Component: Component, options?: renderOptions) => {
  return render(() => (
    <Router>
      <Routes>
        <Route path="/" component={Component} />
      </Routes>
    </Router>
  ))
}
