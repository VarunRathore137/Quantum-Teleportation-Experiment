import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
   children: ReactNode;
   fallback?: ReactNode;
   name?: string;
}

interface State {
   hasError: boolean;
   error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
   public state: State = {
      hasError: false,
      error: null,
   };

   public static getDerivedStateFromError(error: Error): State {
      return { hasError: true, error };
   }

   public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
      console.error('Uncaught error:', error, errorInfo);
   }

   public render() {
      if (this.state.hasError) {
         if (this.props.fallback) {
            return this.props.fallback;
         }

         return (
            <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded m-4 z-[100] relative">
               <h2 className="font-bold mb-2">Something went wrong in {this.props.name || 'Component'}</h2>
               <details className="whitespace-pre-wrap">
                  {this.state.error && this.state.error.toString()}
               </details>
            </div>
         );
      }

      return this.props.children;
   }
}
