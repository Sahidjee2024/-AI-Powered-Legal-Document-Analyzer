export interface DocumentMetadata {
  doc_id: string;
  filename: string;
  file_type: string;
  upload_time: string;
  chunk_count: number;
  session_id: string;
  file_size_kb: number;
}

export interface ExtractedClause {
  clause_type: string;
  title: string;
  content: string;
  page_reference: string;
  importance: 'critical' | 'important' | 'standard';
}

export interface ClauseExtractionResult {
  doc_id: string;
  filename: string;
  clauses: ExtractedClause[];
  total_count: number;
  critical_count: number;
  extracted_at: string;
}

export interface RiskFlag {
  risk_level: 'high' | 'medium' | 'low';
  risk_category: string;
  description: string;
  citation: string;
  recommendation: string;
}

export interface RiskAnalysisResult {
  doc_id: string;
  filename: string;
  risk_flags: RiskFlag[];
  overall_risk: 'high' | 'medium' | 'low';
  high_count: number;
  medium_count: number;
  low_count: number;
  analyzed_at: string;
}

export interface ClauseComparison {
  clause_type: string;
  doc1_content: string | null;
  doc2_content: string | null;
  difference_summary: string;
  risk_delta: 'improved' | 'worsened' | 'neutral' | 'missing';
}

export interface ComparisonResult {
  doc1_id: string;
  doc1_filename: string;
  doc2_id: string;
  doc2_filename: string;
  clause_comparisons: ClauseComparison[];
  overall_summary: string;
  recommendation: string;
  compared_at: string;
}

export interface QueryRecord {
  query_id: string;
  session_id: string;
  question: string;
  answer: string;
  doc_ids: string[];
  sources: string[];
  timestamp: string;
}

export interface SummaryResult {
  doc_id: string;
  filename: string;
  summary: {
    parties?: string[];
    document_type?: string;
    effective_date?: string;
    expiration_date?: string;
    key_obligations?: string[];
    key_restrictions?: string[];
    payment_terms?: string;
    governing_law?: string;
    overall_summary?: string;
  };
}
