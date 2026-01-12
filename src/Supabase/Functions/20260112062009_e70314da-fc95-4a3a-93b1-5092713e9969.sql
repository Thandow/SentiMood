-- Add UPDATE policy for analyses table
CREATE POLICY "Users can update their own analyses"
ON public.analyses FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Add UPDATE policy for analysis_items table
CREATE POLICY "Users can update their own analysis items"
ON public.analysis_items FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.analyses
    WHERE analyses.id = analysis_items.analysis_id
    AND analyses.user_id = auth.uid()
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.analyses
    WHERE analyses.id = analysis_items.analysis_id
    AND analyses.user_id = auth.uid()
  )
);