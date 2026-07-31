'use client';
import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallbackTitle?: string;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export default class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error in section component:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="w-full py-16 px-6 my-8 rounded-xl border border-red-500/30 bg-red-950/10 text-center font-mono">
          <div className="inline-block p-3 rounded-full bg-red-500/10 text-red-400 mb-4">
            ⚠️ SYSTEM EXCEPTION DETECTED
          </div>
          <h3 className="text-lg font-bold text-white mb-2">
            {this.props.fallbackTitle || 'Component Rendering Error'}
          </h3>
          <p className="text-xs text-white/50 max-w-md mx-auto mb-6">
            {this.state.error?.message || 'An unexpected runtime anomaly occurred.'}
          </p>
          <button
            onClick={() => this.setState({ hasError: false })}
            className="px-4 py-2 text-xs font-mono tracking-wider bg-red-500/20 text-red-300 rounded border border-red-500/40 hover:bg-red-500/30 transition-all"
          >
            RETRY COMPONENT
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
